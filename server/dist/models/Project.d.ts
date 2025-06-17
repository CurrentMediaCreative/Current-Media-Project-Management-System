import { ProjectStatus } from '@prisma/client';
export interface Timeframe {
    startDate: string;
    endDate: string;
}
export interface Budget {
    estimated: number;
    actual: number;
}
export interface Contractor {
    name: string;
    email: string;
    role: string;
    rate: number;
}
export interface Project {
    id: string;
    title: string;
    client: string;
    status: ProjectStatus;
    timeframe: Timeframe;
    budget: Budget;
    contractors: Contractor[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectModel: {
    create(data: {
        title: string;
        client: string;
        timeframe: Timeframe;
        budget: Budget;
        contractors: Contractor[];
    }): Promise<Project>;
    findById(id: string): Promise<Project | null>;
    findAll(): Promise<Project[]>;
    update(id: string, data: Partial<{
        title: string;
        client: string;
        status: ProjectStatus;
        timeframe: Timeframe;
        budget: Budget;
        contractors: Contractor[];
    }>): Promise<Project>;
    updateStatus(id: string, status: ProjectStatus): Promise<Project>;
    findByStatus(status: ProjectStatus): Promise<Project[]>;
};
