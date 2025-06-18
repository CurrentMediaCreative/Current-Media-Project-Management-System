export enum ProjectStatus {
  NEW_NOT_SENT = "NEW_NOT_SENT",
  NEW_SENT = "NEW_SENT",
  PENDING_CLICKUP = "PENDING_CLICKUP",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED"
}

export interface Project {
  id: string;
  clickupId?: string;
  title: string;
  client: string;
  status: ProjectStatus;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  budget: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateProjectInput {
  title: string;
  client: string;
  budget: number;
  startDate: Date;
  endDate: Date;
}

export interface UpdateProjectInput {
  title?: string;
  client?: string;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  status?: ProjectStatus;
  clickupId?: string;
}
