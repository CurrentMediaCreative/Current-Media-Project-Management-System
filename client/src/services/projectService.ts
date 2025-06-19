import { Project } from '@shared/types';
import api from '../shared/utils/api';

class ProjectService {
  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Project ${id} not found`);
        return null;
      }
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    try {
      if (!project || Object.keys(project).length === 0) {
        throw new Error('Project data is required');
      }
      const response = await api.post('/projects', project);
      return response.data;
    } catch (error: any) {
      console.error('Error creating project:', error);
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project | null> {
    try {
      if (!project || Object.keys(project).length === 0) {
        throw new Error('Update data is required');
      }
      const response = await api.patch(`/projects/${id}`, project);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Project ${id} not found`);
        return null;
      }
      console.error('Error updating project:', error);
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Project ${id} not found`);
        return false;
      }
      console.error('Error deleting project:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  }

  async checkProjectExists(clickUpId: string): Promise<boolean> {
    try {
      const response = await api.get(`/projects/check/${clickUpId}`);
      return response.data.exists;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      console.error('Error checking project existence:', error);
      throw new Error('Failed to check project existence');
    }
  }

  async saveProgress(id: string, data: Partial<Project>): Promise<Project | null> {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Progress data is required');
      }
      const response = await api.patch(`/projects/${id}/progress`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Project ${id} not found`);
        return null;
      }
      console.error('Error saving project progress:', error);
      throw new Error(error.response?.data?.message || 'Failed to save progress');
    }
  }
}

export const projectService = new ProjectService();
