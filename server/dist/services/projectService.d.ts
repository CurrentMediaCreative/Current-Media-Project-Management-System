import { ProjectStatus } from '@prisma/client';
declare class ProjectService {
    /**
     * Create a new project
     */
    createProject(input: {
        title: string;
        client: string;
        budget: number;
        startDate: Date;
        endDate: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        client: string;
        startDate: Date;
        endDate: Date;
        budget: number;
        clickupId: string | null;
        status: import(".prisma/client").$Enums.ProjectStatus;
    }>;
    /**
     * Get project by ID
     */
    getProjectById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        client: string;
        startDate: Date;
        endDate: Date;
        budget: number;
        clickupId: string | null;
        status: import(".prisma/client").$Enums.ProjectStatus;
    }>;
    /**
     * List projects with optional filtering
     */
    listProjects(params?: {
        skip?: number;
        take?: number;
        status?: ProjectStatus;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        client: string;
        startDate: Date;
        endDate: Date;
        budget: number;
        clickupId: string | null;
        status: import(".prisma/client").$Enums.ProjectStatus;
    }[]>;
    /**
     * Update project details
     */
    updateProject(id: string, input: {
        title?: string;
        client?: string;
        budget?: number;
        startDate?: Date;
        endDate?: Date;
        status?: ProjectStatus;
        clickupId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        client: string;
        startDate: Date;
        endDate: Date;
        budget: number;
        clickupId: string | null;
        status: import(".prisma/client").$Enums.ProjectStatus;
    }>;
    /**
     * Update project status
     */
    updateProjectStatus(id: string, status: ProjectStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        client: string;
        startDate: Date;
        endDate: Date;
        budget: number;
        clickupId: string | null;
        status: import(".prisma/client").$Enums.ProjectStatus;
    }>;
    /**
     * Delete project
     */
    deleteProject(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        client: string;
        startDate: Date;
        endDate: Date;
        budget: number;
        clickupId: string | null;
        status: import(".prisma/client").$Enums.ProjectStatus;
    }>;
}
declare const _default: ProjectService;
export default _default;
