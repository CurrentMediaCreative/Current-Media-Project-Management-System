import { Project } from '@shared/types';
import api from '../shared/utils/api';

class ProjectService {
  async getProjects(): Promise<Project[]> {
    const response = await api.get('/api/projects');
    return response.data;
  }

  async getProject(id: string): Promise<Project> {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const response = await api.post('/api/projects', project);
    return response.data;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await api.patch(`/api/projects/${id}`, project);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/api/projects/${id}`);
  }

  async checkProjectExists(clickUpId: string): Promise<boolean> {
    try {
      const response = await api.get(`/api/projects/check/${clickUpId}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking project existence:', error);
      return false;
    }
  }
}

export const projectService = new ProjectService();
