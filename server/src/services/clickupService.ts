import axios from 'axios';
import dotenv from 'dotenv';
import { ClickUpTask, ClickUpSpace, ClickUpList, MappedProject } from '../../../shared/src/types/clickup';
import { ClickUpMappingService } from './clickupMappingService';

dotenv.config();

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_KEY;
const CLICKUP_API_URL = 'https://api.clickup.com/api/v2';

if (!CLICKUP_API_TOKEN) {
  console.error('CLICKUP_API_KEY is not set in environment variables');
}

interface ClickUpWorkspaceResponse {
  teams: Array<{
    id: string;
    name: string;
    members: Array<{
      user: {
        id: number;
        username: string;
        email: string;
      };
    }>;
  }>;
}

interface ClickUpSpacesResponse {
  spaces: ClickUpSpace[];
}

interface ClickUpListsResponse {
  lists: ClickUpList[];
}

interface ClickUpTasksResponse {
  tasks: ClickUpTask[];
}

class ClickUpService {
  private api;
  private readonly EDITS_LIST_NAME = 'Edits';

  constructor() {
    this.api = axios.create({
      baseURL: CLICKUP_API_URL,
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get all accessible workspaces
   */
  async getWorkspaces(): Promise<ClickUpWorkspaceResponse> {
    try {
      const response = await this.api.get('/team');
      return response.data;
    } catch (error) {
      console.error('Error fetching ClickUp workspaces:', error);
      throw error;
    }
  }

  /**
   * Get all spaces in a workspace
   */
  async getSpaces(workspaceId: string): Promise<ClickUpSpacesResponse> {
    try {
      const response = await this.api.get(`/team/${workspaceId}/space`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ClickUp spaces:', error);
      throw error;
    }
  }

  /**
   * Get all lists in a space
   */
  async getLists(spaceId: string): Promise<ClickUpListsResponse> {
    try {
      const response = await this.api.get(`/space/${spaceId}/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ClickUp lists:', error);
      throw error;
    }
  }

  /**
   * Find the Edits list across all spaces
   */
  private async findEditsList(): Promise<ClickUpList | null> {
    try {
      // Get all workspaces
      const workspaceResponse = await this.getWorkspaces();
      const workspaceId = workspaceResponse.teams[0].id;

      // Get all spaces
      const spacesResponse = await this.getSpaces(workspaceId);
      const spaces = spacesResponse.spaces;

      // Search through all spaces for the Edits list
      for (const space of spaces) {
        const listsResponse = await this.getLists(space.id);
        const editsList = listsResponse.lists.find(list => list.name === this.EDITS_LIST_NAME);
        if (editsList) {
          console.log('Found Edits list:', editsList);
          return editsList;
        }
      }

      console.error('Edits list not found in any space');
      return null;
    } catch (error) {
      console.error('Error finding Edits list:', error);
      throw error;
    }
  }

  /**
   * Get all tasks across all lists
   */
  async getAllTasks(): Promise<MappedProject[]> {
    try {
      // Find the Edits list
      const editsList = await this.findEditsList();
      if (!editsList) {
        throw new Error('Edits list not found');
      }

      // Get tasks only from the Edits list
      return await this.getTasks(editsList.id);
    } catch (error) {
      console.error('Error fetching all ClickUp tasks:', error);
      throw error;
    }
  }

  /**
   * Get all tasks in a list
   */
  async getTasks(listId: string): Promise<MappedProject[]> {
    try {
      const response = await this.api.get<ClickUpTasksResponse>(`/list/${listId}/task`);
      if (!response.data || !response.data.tasks || !Array.isArray(response.data.tasks)) {
        throw new Error('Invalid response format from ClickUp API');
      }
      const tasks = response.data.tasks;
      
      // Log the first task for debugging
      if (tasks.length > 0) {
        console.log('Raw task data:', JSON.stringify(tasks[0], null, 2));
      }
      
      return tasks.map(task => ClickUpMappingService.mapTaskToProject(task));
    } catch (error) {
      console.error('Error fetching ClickUp tasks:', error);
      throw error;
    }
  }

  /**
   * Get detailed task information
   */
  async getTask(taskId: string): Promise<MappedProject> {
    try {
      const response = await this.api.get<ClickUpTask>(`/task/${taskId}`);
      return ClickUpMappingService.mapTaskToProject(response.data);
    } catch (error) {
      console.error('Error fetching ClickUp task:', error);
      throw error;
    }
  }

  /**
   * Get custom fields for a list
   */
  async getCustomFields(listId: string): Promise<any> {
    try {
      const response = await this.api.get(`/list/${listId}/field`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ClickUp custom fields:', error);
      throw error;
    }
  }

  /**
   * Get all views in a space
   */
  async getViews(spaceId: string): Promise<any> {
    try {
      const response = await this.api.get(`/space/${spaceId}/view`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ClickUp views:', error);
      throw error;
    }
  }
}

export const clickupService = new ClickUpService();
export default clickupService;
