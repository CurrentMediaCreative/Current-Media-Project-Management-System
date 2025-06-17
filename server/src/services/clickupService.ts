import axios from 'axios';
import dotenv from 'dotenv';
import { ClickUpTask, ClickUpSpace, ClickUpList } from '../../../shared/src/types/clickup';
import { ClickUpMappingService } from './clickupMappingService';

dotenv.config();

const CLICKUP_API_TOKEN = 'pk_120182095_6E7D5HG4B6EEB62Z50KZI1BHGO4G1NSS';
const CLICKUP_API_URL = 'https://api.clickup.com/api/v2';

class ClickUpService {
  private api;

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
  async getWorkspaces() {
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
  async getSpaces(workspaceId: string) {
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
  async getLists(spaceId: string) {
    try {
      const response = await this.api.get(`/space/${spaceId}/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ClickUp lists:', error);
      throw error;
    }
  }

  /**
   * Get all tasks in a list
   */
  async getTasks(listId: string) {
    try {
      const response = await this.api.get(`/list/${listId}/task`);
      if (!response.data || !response.data.tasks || !Array.isArray(response.data.tasks)) {
        throw new Error('Invalid response format from ClickUp API');
      }
      const tasks = response.data.tasks as ClickUpTask[];
      
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
  async getTask(taskId: string) {
    try {
      const response = await this.api.get(`/task/${taskId}`);
      const task = response.data as ClickUpTask;
      return ClickUpMappingService.mapTaskToProject(task);
    } catch (error) {
      console.error('Error fetching ClickUp task:', error);
      throw error;
    }
  }

  /**
   * Get custom fields for a list
   */
  async getCustomFields(listId: string) {
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
  async getViews(spaceId: string) {
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
