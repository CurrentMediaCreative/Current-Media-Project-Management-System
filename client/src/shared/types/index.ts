// Project Types
export enum ProjectStatus {
  NEW_NOT_SENT = 'new_not_sent',
  NEW_SENT = 'new_sent',
  PENDING_CLICKUP = 'pending_clickup',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface ProjectMetadata {
  category?: string;
  notes?: string;
  [key: string]: any;
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
  contractors: Contractor[];
  metadata?: ProjectMetadata;
  createdAt?: Date;
  updatedAt?: Date;
  clickUpId?: string;  // Reference to associated ClickUp task if synced
}

// Combined type that represents a project that exists both locally and in ClickUp
export interface CombinedProject extends LocalProject {
  clickUp?: {
    id: string;
    name: string;
    status: string;
    statusColor: string;
    url: string;
    customFields: {
      [key: string]: string | number | null;
    };
  };
}

// Type guard to check if a project has ClickUp data
export function isClickUpSynced(project: LocalProject): project is CombinedProject {
  return 'clickUp' in project && project.clickUp !== undefined;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TechnicalRequirement {
  id: string;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ProjectScope {
  requirements: string[];
  deliverables: Deliverable[];
  technicalRequirements: TechnicalRequirement[];
  additionalNotes?: string;
}

export interface LocalProjectFormData {
  title: string;
  client: string;
  timeframe: {
    startDate: string;
    endDate: string;
  };
  budget: {
    estimated: number;
    actual: number;
  };
  contractors: Contractor[];
  scope?: ProjectScope;
}

// Contractor Types
export interface Contractor {
  name: string;
  email: string;
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// API Response Types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter and Sort Types
export interface LocalProjectFilters {
  status?: ProjectStatus;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  minBudget?: number;
  maxBudget?: number;
}

export interface ProjectSortOptions {
  field: keyof LocalProject;
  direction: 'asc' | 'desc';
}
