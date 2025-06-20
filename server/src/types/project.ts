export enum ProjectStatus {
  NEW_NOT_SENT = 'new_not_sent',
  NEW_SENT = 'new_sent',
  PENDING_CLICKUP = 'pending_clickup',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export interface LocalProject {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  timeframe: {
    startDate: string;
    endDate: string;
  };
  budget: {
    estimated: number;
    actual: number;
  };
  contractors: Array<{
    name: string;
    email: string;
    role: string;
    baseRate: number;
    chargeOutRate: number;
    isFixed: boolean;
  }>;
  metadata?: {
    category?: string;
    notes?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
  clickUpId?: string;
}

export interface ClickUpData {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  url: string;
  customFields: {
    [key: string]: string | number | null;
  };
}

export interface ProjectPageData {
  local?: LocalProject;
  clickUp?: ClickUpData;
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
