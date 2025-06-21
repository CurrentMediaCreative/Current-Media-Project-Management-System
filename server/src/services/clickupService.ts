import axios from 'axios';
import { ClickUpTask } from '../types/clickup';

class ClickUpService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CLICKUP_API_KEY || '';
    this.baseUrl = 'https://api.clickup.com/api/v2';
  }

  private getHeaders() {
    return {
      'Authorization': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async getTasks(): Promise<ClickUpTask[]> {
    const response = await axios.get(`${this.baseUrl}/team/tasks`, {
      headers: this.getHeaders()
    });
    return response.data.tasks;
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

  // Additional helper methods for workspace/space/list management
  async getWorkspaces(): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/team`, {
      headers: this.getHeaders()
    });
    return response.data.teams;
  }

  async getSpaces(teamId: string): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/team/${teamId}/space`, {
      headers: this.getHeaders()
    });
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
    const workspaces = await this.getWorkspaces();
    let allTasks: ClickUpTask[] = [];

    for (const workspace of workspaces) {
      const spaces = await this.getSpaces(workspace.id);
      for (const space of spaces) {
        const lists = await this.getLists(space.id);
        for (const list of lists) {
          const response = await axios.get(`${this.baseUrl}/list/${list.id}/task`, {
            headers: this.getHeaders()
          });
          allTasks = [...allTasks, ...response.data.tasks];
        }
      }
    }

    return allTasks;
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
