import { ProjectStatus, ClickUpStatus } from '@prisma/client';
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
declare class ProjectService {
    /**
     * Create a new project
     */
    createProject(data: {
        name: string;
        client: string;
        producer: string;
        budget: number;
        scope: string;
        timeframe: ProjectTimeframe;
        contractors?: ProjectContractor[];
        estimatedCosts?: ProjectCosts;
        createdById: string;
    }): Promise<any>;
    /**
     * Get project by ID
     */
    getProjectById(id: string): Promise<any>;
    /**
     * List projects with optional filtering
     */
    listProjects(params?: {
        skip?: number;
        take?: number;
        status?: ProjectStatus;
        createdById?: string;
    }): Promise<any>;
    /**
     * Update project details
     */
    updateProject(id: string, data: {
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
    }): Promise<any>;
    /**
     * Update project costs
     */
    updateProjectCosts(projectId: string, estimatedCosts?: ProjectCosts, actualCosts?: ProjectCosts): Promise<any>;
    /**
     * Update project status
     */
    updateProjectStatus(id: string, status: ProjectStatus): Promise<any>;
    /**
     * Update ClickUp sync status
     */
    updateClickUpStatus(id: string, clickUpStatus: ClickUpStatus): Promise<any>;
    /**
     * Delete project
     */
    deleteProject(id: string): Promise<any>;
}
declare const _default: ProjectService;
export default _default;
