/**
 * ClickUp Service
 * 
 * This service provides read-only access to ClickUp data.
 * It is used to fetch and display project information from ClickUp,
 * but never modifies any data in ClickUp. All modifications are
 * handled locally in our own system.
 */

import { ClickUpTask } from '../types/clickup';
import api from '../utils/api';

class ClickUpService {
  async getTask(taskId: string): Promise<ClickUpTask | null> {
    try {
      const response = await api.get(`/clickup/tasks/${taskId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Task ${taskId} not found`);
        return null;
      }
      throw error;
    }
  }

  async getSubTasks(taskId: string): Promise<ClickUpTask[] | null> {
    try {
      const response = await api.get(`/clickup/tasks/${taskId}/subtasks`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`No subtasks found for task ${taskId}`);
        return null;
      }
      throw error;
    }
  }

}

export const clickupService = new ClickUpService();
