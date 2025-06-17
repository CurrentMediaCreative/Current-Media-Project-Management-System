// Project Types
export interface Project {
  id: string;
  title: string;
  client: string;
  status: string;
  timeframe: {
    startDate: string;
    endDate: string;
  };
  budget: {
    estimated: number;
    actual: number;
  };
  contractors: Contractor[];
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

export interface ProjectFormData {
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
export interface ProjectFilters {
  status?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  minBudget?: number;
  maxBudget?: number;
}

export interface ProjectSortOptions {
  field: keyof Project;
  direction: 'asc' | 'desc';
}
