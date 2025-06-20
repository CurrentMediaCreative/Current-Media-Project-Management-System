import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils';
import { storage } from './storageService';
import { Project, ProjectStatus, CreateProjectInput, UpdateProjectInput } from '../types/project';

const PROJECTS_FILE = 'projects.json';

class ProjectService {
  /**
   * Create a new project
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    // Validate timeframe
    if (input.endDate < input.startDate) {
      throw new ApiError(400, 'End date must be after start date');
    }

    const projects = await storage.read<Project[]>(PROJECTS_FILE);
    
    const newProject: Project = {
      id: uuidv4(),
      title: input.title,
      client: input.client,
      status: ProjectStatus.NEW_NOT_SENT,
      timeframe: {
        startDate: input.startDate.toISOString(),
        endDate: input.endDate.toISOString()
      },
      budget: {
        estimated: input.budget,
        actual: 0
      },
      contractors: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    projects.push(newProject);
    await storage.write(PROJECTS_FILE, projects);

    return newProject;
  }

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<Project> {
    const projects = await storage.read<Project[]>(PROJECTS_FILE);
    const project = projects.find(p => p.id === id);
    
    if (!project) {
      throw new ApiError(404, `Project not found: ${id}`);
    }
    
    return project;
  }

  /**
   * List projects with optional filtering
   */
  async listProjects(params: {
    skip?: number;
    take?: number;
    status?: ProjectStatus;
  } = {}): Promise<Project[]> {
    let projects = await storage.read<Project[]>(PROJECTS_FILE);

    // Apply filters
    if (params.status) {
      projects = projects.filter(p => p.status === params.status);
    }

    // Sort by createdAt desc
    projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    if (params.skip || params.take) {
      const start = params.skip || 0;
      const end = params.take ? start + params.take : undefined;
      projects = projects.slice(start, end);
    }

    return projects;
  }

  /**
   * Update project details
   */
  async updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
    const projects = await storage.read<Project[]>(PROJECTS_FILE);
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new ApiError(404, `Project not found: ${id}`);
    }

    // Validate timeframe if updating both dates
    if (input.startDate && input.endDate) {
      if (input.endDate < input.startDate) {
        throw new ApiError(400, 'End date must be after start date');
      }
    }

    const updatedProject: Project = {
      ...projects[index],
      title: input.title ?? projects[index].title,
      client: input.client ?? projects[index].client,
      status: input.status ?? projects[index].status,
      timeframe: {
        startDate: input.startDate ? input.startDate.toISOString() : projects[index].timeframe.startDate,
        endDate: input.endDate ? input.endDate.toISOString() : projects[index].timeframe.endDate
      },
      budget: {
        estimated: input.budget ?? projects[index].budget.estimated,
        actual: projects[index].budget.actual
      },
      contractors: projects[index].contractors,
      updatedAt: new Date(),
      clickUpId: input.clickupId ?? projects[index].clickUpId
    };

    projects[index] = updatedProject;
    await storage.write(PROJECTS_FILE, projects);

    return updatedProject;
  }

  /**
   * Update project status
   */
  async updateProjectStatus(id: string, status: ProjectStatus): Promise<Project> {
    return this.updateProject(id, { status });
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    const projects = await storage.read<Project[]>(PROJECTS_FILE);
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new ApiError(404, `Project not found: ${id}`);
    }

    projects.splice(index, 1);
    await storage.write(PROJECTS_FILE, projects);
  }
}

export default new ProjectService();
