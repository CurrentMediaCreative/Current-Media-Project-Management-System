import { LocalProject, CombinedProject } from '@shared/types';
import api from '../shared/utils/api';

type ProjectType = LocalProject | CombinedProject;

class ProjectService {
  async getProjects(): Promise<ProjectType[]> {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  async getProject(id: string): Promise<ProjectType | null> {
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

  async createProject(project: Partial<LocalProject>): Promise<LocalProject> {
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

  async updateProject(id: string, project: Partial<ProjectType>): Promise<ProjectType | null> {
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
      if (!clickUpId) {
        throw new Error('ClickUp ID is required');
      }

      const response = await api.get(`/projects/check/${clickUpId}`);
      return response.data.exists;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        console.error('Authentication failed during project check:', {
          clickUpId,
          status: error.response.status,
          message: error.response.data?.message
        });
        throw new Error('Authentication failed. Please log in again.');
      }

      if (error.response?.status === 404) {
        console.warn(`No project found with ClickUp ID: ${clickUpId}`);
        return false;
      }

      if (error.response?.status === 503) {
        console.error('Storage service unavailable:', {
          clickUpId,
          status: error.response.status,
          code: error.response.data?.code,
          message: error.response.data?.message
        });
        throw new Error('Service temporarily unavailable. Please try again later.');
      }

      // Log detailed error information
      console.error('Project check failed:', {
        clickUpId,
        status: error.response?.status,
        code: error.response?.data?.code,
        message: error.message,
        requestId: error.response?.data?.requestId
      });

      // Throw error with specific message if available
      throw new Error(error.response?.data?.message || 'Failed to check project existence');
    }
  }

  async saveProgress(id: string, data: Partial<ProjectType>): Promise<ProjectType | null> {
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
