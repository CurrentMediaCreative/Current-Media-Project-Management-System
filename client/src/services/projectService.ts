import { 
  LocalProject, 
  ProjectPageData, 
  ProjectStatus, 
  Budget, 
  ProjectScope, 
  Contractor,
  ProjectFormData,
  ProjectCreationBudget
} from '../types';
import api from '../utils/api';

type ProjectType = ProjectPageData;

interface CreateProjectData {
  status: ProjectStatus;
  budget: ProjectCreationBudget;
  title: string;
  client: string;
  timeframe: {
    startDate: string;
    endDate: string;
  };
  contractors: Contractor[];
  scope?: ProjectScope;
  metadata?: Record<string, any>;
}

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

  async createProject(project: CreateProjectData): Promise<LocalProject> {
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

  async checkProjectExists(clickUpId: string, retryAttempt = 0): Promise<boolean> {
    try {
      if (!clickUpId) {
        throw new Error('ClickUp ID is required');
      }

      const response = await api.get(`/projects/check/${clickUpId}`);
      return response.data.exists;
    } catch (error: any) {
      // Log detailed error information
      console.error('Project check failed:', {
        clickUpId,
        status: error.response?.status,
        code: error.response?.data?.code,
        message: error.message,
        requestId: error.response?.data?.requestId,
        attempt: retryAttempt + 1
      });

      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error('Invalid ClickUp ID provided');
      }

      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }

      if (error.response?.status === 404) {
        return false;
      }

      // Handle service unavailability with retry logic
      if (error.response?.status === 503) {
        const retryAfter = error.response.data?.retryAfter || 5;
        const maxRetries = 3;

        if (retryAttempt < maxRetries) {
          // Wait for the suggested retry time
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          // Retry the request
          return this.checkProjectExists(clickUpId, retryAttempt + 1);
        }

        throw new Error('Service is temporarily unavailable. Please try again later.');
      }

      // Handle data integrity errors
      if (error.response?.data?.code === 'DATA_INTEGRITY_ERROR') {
        throw new Error('Unable to verify project due to data integrity issues. Please contact support.');
      }

      // For any other errors, include request ID in error message if available
      const requestId = error.response?.data?.requestId;
      throw new Error(
        `Failed to check project existence. ${requestId ? `Reference ID: ${requestId}` : ''}`
      );
    }
  }

  async saveProgress(id: string, data: ProjectFormData): Promise<ProjectType | null> {
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
