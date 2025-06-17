import { PrismaClient, ProjectStatus, ClickUpStatus, Prisma } from '@prisma/client';
import { Project } from '../models/Project';
import { ApiError } from '../utils';
import contractorRateService from './contractorRateService';

const prisma = new PrismaClient();

interface ProjectTimeframe {
  startDate: Date;
  endDate: Date;
}

interface ProjectContractor {
  role: string;
  rate: number;
  estimatedHours?: number;
  estimatedDays?: number;
  confirmed: boolean;
  confirmationDate?: Date;
  declineReason?: string;
  emailSent: boolean;
  emailSentDate?: Date;
}

interface CostItem {
  type: string;
  description: string;
  amount: number;
}

interface ProjectCosts {
  contractors: {
    role: string;
    hours?: number;
    days?: number;
    rate: number;
    total: number;
  }[];
  equipment: CostItem[];
  travel: CostItem[];
  other: CostItem[];
  totalAmount: number;
  hstAmount: number;
}

class ProjectService {
  /**
   * Create a new project
   */
  async createProject(data: {
    name: string;
    client: string;
    producer: string;
    budget: number;
    scope: string;
    timeframe: ProjectTimeframe;
    contractors?: ProjectContractor[];
    estimatedCosts?: ProjectCosts;
    createdById: string;
  }) {
    // Validate timeframe
    if (data.timeframe.endDate < data.timeframe.startDate) {
      throw new ApiError(400, 'End date must be after start date');
    }

    // Validate contractors if provided
    if (data.contractors) {
      for (const contractor of data.contractors) {
        // Validate rate for role
        await contractorRateService.validateRateForRole(contractor.role, contractor.rate);
      }
    }

    return Project.create(data);
  }

  /**
   * Get project by ID
   */
  async getProjectById(id: string) {
    const project = await Project.findById(id);
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
    createdById?: string;
  } = {}) {
    return Project.list(params);
  }

  /**
   * Update project details
   */
  async updateProject(id: string, data: {
    name?: string;
    client?: string;
    producer?: string;
    budget?: number;
    scope?: string;
    timeframe?: ProjectTimeframe;
    status?: ProjectStatus;
    clickUpStatus?: ClickUpStatus;
    contractors?: ProjectContractor[];
    estimatedCosts?: ProjectCosts;
    actualCosts?: ProjectCosts;
  }) {
    // Validate project exists
    const project = await this.getProjectById(id);

    // Validate timeframe if updating
    if (data.timeframe) {
      if (data.timeframe.endDate < data.timeframe.startDate) {
        throw new ApiError(400, 'End date must be after start date');
      }
    }

    // Validate contractors if updating
    if (data.contractors) {
      for (const contractor of data.contractors) {
        // Validate rate for role
        await contractorRateService.validateRateForRole(contractor.role, contractor.rate);
      }
    }

    return Project.update(id, data);
  }

  /**
   * Update project costs
   */
  async updateProjectCosts(projectId: string, estimatedCosts?: ProjectCosts, actualCosts?: ProjectCosts) {
    // Validate project exists
    await this.getProjectById(projectId);

    // Validate contractor rates if updating
    if (estimatedCosts) {
      for (const contractor of estimatedCosts.contractors) {
        await contractorRateService.validateRateForRole(contractor.role, contractor.rate);
      }
    }
    if (actualCosts) {
      for (const contractor of actualCosts.contractors) {
        await contractorRateService.validateRateForRole(contractor.role, contractor.rate);
      }
    }

    return Project.updateCosts(projectId, estimatedCosts, actualCosts);
  }

  /**
   * Update project status
   */
  async updateProjectStatus(id: string, status: ProjectStatus) {
    // Validate project exists
    await this.getProjectById(id);

    return Project.update(id, { status });
  }

  /**
   * Update ClickUp sync status
   */
  async updateClickUpStatus(id: string, clickUpStatus: ClickUpStatus) {
    // Validate project exists
    await this.getProjectById(id);

    return Project.update(id, { clickUpStatus });
  }

  /**
   * Delete project
   */
  async deleteProject(id: string) {
    // Validate project exists
    await this.getProjectById(id);

    return Project.delete(id);
  }
}

export default new ProjectService();
