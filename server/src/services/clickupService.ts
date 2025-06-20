import axios from 'axios';
import dotenv from 'dotenv';
import { ClickUpTask, ClickUpSpace, ClickUpList, ClickUpCustomField, ClickUpCustomFieldOption } from '../types/clickup';
import { ProjectPageData, ProjectStatus } from '../types/project';
import { CLICKUP_FIELD_NAMES } from '../utils/projectHelpers';

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

  private static mapStatus(status: string): ProjectStatus {
    const lowerStatus = status.toLowerCase();
    
    // Active statuses
    if (['to do', 'media needed', 'in progress', 'revision'].includes(lowerStatus)) {
      return ProjectStatus.ACTIVE;
    }
    
    // Completed status
    if (lowerStatus === 'done') {
      return ProjectStatus.COMPLETED;
    }

    // For local statuses, validate and return if they match our ProjectStatus type
    if (status === ProjectStatus.NEW_NOT_SENT) {
      return ProjectStatus.NEW_NOT_SENT;
    }
    if (status === ProjectStatus.NEW_SENT) {
      return ProjectStatus.NEW_SENT;
    }
    if (status === ProjectStatus.ARCHIVED) {
      return ProjectStatus.ARCHIVED;
    }

    // Default to ACTIVE if we don't recognize the status
    return ProjectStatus.ACTIVE;
  }

  private static extractCustomFieldValue(field: ClickUpCustomField): string | number | null {
    if (field.value === undefined || field.value === null) return null;

    // Handle different field types
    switch (field.type) {
      case 'drop_down':
        if (field.type_config.options && typeof field.value === 'number') {
          // For dropdown fields, try direct array index first
          const optionByIndex = field.type_config.options[field.value];
          if (optionByIndex) {
            return optionByIndex.name || null;
          }
          // If no match by index, try finding by orderindex
          const optionByOrderIndex = field.type_config.options.find(
            (opt: ClickUpCustomFieldOption) => opt.orderindex === field.value
          );
          if (optionByOrderIndex) {
            return optionByOrderIndex.name || null;
          }
        }
        return null;
      case 'short_text':
      case 'text':
      case 'url':
        return String(field.value);
      case 'currency':
        return typeof field.value === 'number' ? field.value : parseFloat(String(field.value));
      default:
        return String(field.value);
    }
  }

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
  async getAllTasks(): Promise<ProjectPageData[]> {
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
  async getTasks(listId: string): Promise<ProjectPageData[]> {
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
      
      return tasks.map(task => {
        const customFields = task.custom_fields?.reduce((acc, field) => {
          const value = ClickUpService.extractCustomFieldValue(field);
          if (value !== null) {
            acc[field.name] = value;
          }
          return acc;
        }, {} as { [key: string]: string | number | null }) || {};

        const clientName = customFields[CLICKUP_FIELD_NAMES.CLIENT] as string || 'No Client';
        const rawStatus = task.status?.status || '';
        const mappedStatus = ClickUpService.mapStatus(rawStatus);

        return {
          clickUp: {
            id: task.id,
            name: task.name,
            status: rawStatus,
            statusColor: task.status?.color || '',
            url: task.url || '',
            customFields
          },
          local: {
            id: task.id,
            title: task.name,
            client: clientName,
            status: mappedStatus,
            timeframe: {
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString()
            },
            budget: {
              estimated: 0,
              actual: 0
            },
            contractors: [],
            metadata: {
              category: customFields[CLICKUP_FIELD_NAMES.TASK_TYPE] as string || undefined,
              notes: ''
            },
            createdAt: task.date_created ? new Date(parseInt(task.date_created)) : new Date(),
            updatedAt: task.date_updated ? new Date(parseInt(task.date_updated)) : new Date()
          }
        };
      });
    } catch (error) {
      console.error('Error fetching ClickUp tasks:', error);
      throw error;
    }
  }

  /**
   * Get detailed task information
   */
  async getTask(taskId: string): Promise<ProjectPageData | null> {
    try {
      const response = await this.api.get<ClickUpTask>(`/task/${taskId}`);
      if (!response.data) {
        console.warn(`No data returned for task ${taskId}`);
        return null;
      }
      const task = response.data;
      const customFields = task.custom_fields?.reduce((acc, field) => {
        const value = ClickUpService.extractCustomFieldValue(field);
        if (value !== null) {
          acc[field.name] = value;
        }
        return acc;
      }, {} as { [key: string]: string | number | null }) || {};

      const clientName = customFields[CLICKUP_FIELD_NAMES.CLIENT] as string || 'No Client';
      const rawStatus = task.status?.status || '';
      const mappedStatus = ClickUpService.mapStatus(rawStatus);

      return {
        clickUp: {
          id: task.id,
          name: task.name,
          status: rawStatus,
          statusColor: task.status?.color || '',
          url: task.url || '',
          customFields
        },
        local: {
          id: task.id,
          title: task.name,
          client: clientName,
          status: mappedStatus,
          timeframe: {
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString()
          },
          budget: {
            estimated: 0,
            actual: 0
          },
          contractors: [],
          metadata: {
            category: customFields[CLICKUP_FIELD_NAMES.TASK_TYPE] as string || undefined,
            notes: ''
          },
          createdAt: task.date_created ? new Date(parseInt(task.date_created)) : new Date(),
          updatedAt: task.date_updated ? new Date(parseInt(task.date_updated)) : new Date()
        }
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Task ${taskId} not found in ClickUp`);
        return null;
      }
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access to ClickUp API');
      }
      console.error('Error fetching ClickUp task:', error);
      throw error;
    }
  }

  /**
   * Get subtasks for a task
   */
  async getSubTasks(taskId: string): Promise<ClickUpTask[] | null> {
    try {
      const response = await this.api.get<ClickUpTasksResponse>(`/task/${taskId}/subtask`);
      if (!response.data || !response.data.tasks) {
        console.warn(`No subtasks found for task ${taskId}`);
        return null;
      }
      return response.data.tasks;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Parent task ${taskId} not found in ClickUp`);
        return null;
      }
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access to ClickUp API');
      }
      console.error('Error fetching ClickUp subtasks:', error);
      throw error;
    }
  }


}

/**
 * This service provides read-only access to ClickUp data.
 * It is used to display project information from ClickUp but never modifies ClickUp data.
 * All modifications are handled locally in our own system.
 */
export const clickupService = new ClickUpService();
export default clickupService;
