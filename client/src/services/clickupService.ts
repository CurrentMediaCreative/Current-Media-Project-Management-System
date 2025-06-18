import { ClickUpTask } from '@shared/types/clickup';
import api from '../shared/utils/api';

class ClickUpService {
  async getTask(taskId: string): Promise<ClickUpTask> {
    const response = await api.get(`/api/clickup/tasks/${taskId}`);
    return response.data;
  }

  async getSubTasks(taskId: string): Promise<ClickUpTask[]> {
    const response = await api.get(`/api/clickup/tasks/${taskId}/subtasks`);
    return response.data;
  }

  async updateTask(taskId: string, data: Partial<ClickUpTask>): Promise<ClickUpTask> {
    const response = await api.patch(`/api/clickup/tasks/${taskId}`, data);
    return response.data;
  }
}

export const clickupService = new ClickUpService();
