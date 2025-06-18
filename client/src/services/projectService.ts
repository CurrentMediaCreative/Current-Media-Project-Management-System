import { Project, ProjectFormData, ApiError } from '../shared/types';

class ProjectService {
  private baseUrl = '/api/projects';

  async createProject(data: ProjectFormData): Promise<Project> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async getProject(id: string): Promise<Project> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Failed to fetch project');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Failed to update project');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Failed to fetch projects');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async saveProgress(data: ProjectFormData): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();
