import axios from 'axios';
import { ClickUpTask } from '../types/clickup';

class ClickUpService {
  private apiKey: string;
  private baseUrl: string;
  private teamId: string;
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    const apiKey = process.env.CLICKUP_API_KEY;
    const teamId = process.env.CLICKUP_WORKSPACE_ID;

    if (!apiKey) {
      throw new Error('CLICKUP_API_KEY environment variable is not set');
    }
    if (!teamId) {
      throw new Error('CLICKUP_WORKSPACE_ID environment variable is not set');
    }

    this.apiKey = apiKey;
    this.teamId = teamId;
    this.baseUrl = 'https://api.clickup.com/api/v2';

    // Log initialization (but not the actual values)
    console.log('ClickUpService initialized with API key and team ID');
  }

  private getHeaders() {
    // Log header generation (but not the actual values)
    console.log('Generating headers with API key:', this.apiKey ? '✓ Present' : '✗ Missing');
    
    return {
      'Authorization': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  private async validateConfig() {
    if (!this.apiKey) {
      throw new Error('ClickUp API key is not configured');
    }
    if (!this.teamId) {
      throw new Error('ClickUp team ID is not configured');
    }
  }

  private async retryRequest<T>(request: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await request();
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }
    throw lastError;
  }

  async getTasks(): Promise<ClickUpTask[]> {
    return this.getAllTasks();
  }

  async getTask(taskId: string): Promise<ClickUpTask | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/task/${taskId}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createTask(taskData: Partial<ClickUpTask>): Promise<ClickUpTask> {
    const response = await axios.post(`${this.baseUrl}/list/${taskData.list?.id}/task`, taskData, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateTask(taskId: string, taskData: Partial<ClickUpTask>): Promise<ClickUpTask> {
    const response = await axios.put(`${this.baseUrl}/task/${taskId}`, taskData, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/task/${taskId}`, {
      headers: this.getHeaders()
    });
  }

  // Get authorized teams first
  async getTeams(): Promise<any> {
    console.log('Getting authorized teams');
    const response = await axios.get(`${this.baseUrl}/team`, {
      headers: this.getHeaders()
    });
    console.log('Teams response:', response.data);
    return response.data.teams;
  }

  // Get spaces for a team
  async getSpaces(teamId: string): Promise<any> {
    console.log('Getting spaces for team:', teamId);
    const response = await axios.get(`${this.baseUrl}/team/${teamId}/space?archived=false`, {
      headers: this.getHeaders()
    });
    console.log('Spaces response:', response.data);
    return response.data.spaces;
  }

  async getLists(spaceId: string): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/space/${spaceId}/list`, {
      headers: this.getHeaders()
    });
    return response.data.lists;
  }

  async getSubTasks(taskId: string): Promise<ClickUpTask[]> {
    const response = await axios.get(`${this.baseUrl}/task/${taskId}/subtask`, {
      headers: this.getHeaders()
    });
    return response.data.tasks;
  }

  async getAllTasks(): Promise<ClickUpTask[]> {
    await this.validateConfig();
    
    try {
      let allTasks: ClickUpTask[] = [];

      // Get teams first
      const teams = await this.retryRequest(() => this.getTeams());
      console.log('Found teams:', teams);

      if (!teams || teams.length === 0) {
        throw new Error('No teams found');
      }

      // Use the first team's ID to get spaces
      const spaces = await this.retryRequest(() => 
        this.getSpaces(teams[0].id)
      );

      for (const space of spaces) {
        try {
          const lists = await this.retryRequest(() => 
            this.getLists(space.id)
          );

          // Only get tasks from the "Edits" list
          const editsList = lists.find((list: any) => list.name === "Edits");
          if (editsList) {
            try {
              const response = await this.retryRequest(() =>
                axios.get(`${this.baseUrl}/list/${editsList.id}/task?archived=false`, {
                  headers: this.getHeaders(),
                  params: {
                    subtasks: true,
                    include_closed: true
                  }
                })
              );
              
              if (response.data && Array.isArray(response.data.tasks)) {
                allTasks = [...allTasks, ...response.data.tasks];
              } else {
                console.warn(`Unexpected response format for list ${editsList.id}:`, response.data);
              }
            } catch (listError) {
              console.error(`Error fetching tasks for list ${editsList.id}:`, listError);
            }
          }
        } catch (spaceError) {
          console.error(`Error fetching lists for space ${space.id}:`, spaceError);
          // Continue with next space
        }
      }

      return allTasks;
    } catch (error) {
      console.error('Error in getAllTasks:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch ClickUp tasks');
    }
  }

  async findTaskIdByName(taskName: string): Promise<string | null> {
    const tasks = await this.getAllTasks();
    const task = tasks.find(t => t.name === taskName);
    return task ? task.id : null;
  }

  async pollForUpdates(): Promise<{
    updated: ClickUpTask[];
    completed: ClickUpTask[];
    archived: ClickUpTask[];
  }> {
    const tasks = await this.getAllTasks();
    const projectService = (await import('./projectService')).projectService;
    const projects = await projectService.getProjects();
    
    const updated: ClickUpTask[] = [];
    const completed: ClickUpTask[] = [];
    const archived: ClickUpTask[] = [];

    // Process each task
    for (const task of tasks) {
      const matchingProject = projects.find(p => p.clickUpId === task.id);
      if (matchingProject) {
        // Check status changes
        if (task.status.status === 'complete' && matchingProject.status !== 'COMPLETED') {
          completed.push(task);
          await projectService.updateProject(matchingProject.id, { status: 'COMPLETED' });
        } else if (task.status.status === 'archived' && matchingProject.status !== 'ARCHIVED') {
          archived.push(task);
          await projectService.updateProject(matchingProject.id, { status: 'ARCHIVED' });
        } else if (task.status.status !== matchingProject.status) {
          updated.push(task);
          await projectService.updateProject(matchingProject.id, { status: task.status.status });
        }
      }
    }

    return { updated, completed, archived };
  }
}

export const clickupService = new ClickUpService();
