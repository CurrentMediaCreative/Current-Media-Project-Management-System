import { ClickUpTask } from '../types/clickup';
import api from '../shared/utils/api';

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

  async updateTask(taskId: string, data: Partial<ClickUpTask>): Promise<ClickUpTask | null> {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Update data is required');
      }
      const response = await api.patch(`/clickup/tasks/${taskId}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Task ${taskId} not found`);
        return null;
      }
      if (error.response?.status === 400) {
        throw new Error(`Invalid update data: ${error.response.data?.message || 'Unknown error'}`);
      }
      throw error;
    }
  }
}

export const clickupService = new ClickUpService();
