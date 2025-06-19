export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER',
}

export enum ContractorRole {
  PRODUCER = 'PRODUCER',
  SHOOTER = 'SHOOTER',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
  SOUND_ENGINEER = 'SOUND_ENGINEER',
  SENIOR_EDITOR = 'SENIOR_EDITOR',
  JUNIOR_EDITOR = 'JUNIOR_EDITOR'
}

export enum ProjectStatus {
  NEW_NOT_SENT = 'new_not_sent',
  NEW_SENT = 'new_sent',
  PENDING_CLICKUP = 'pending_clickup',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  password?: string;
}

export interface Timeframe {
  startDate: string;  // ISO date string
  endDate: string;    // ISO date string
}

export interface Budget {
  estimated: number;
  actual: number;
  profitTarget?: number;
  contingencyPercentage?: number;
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  percentage?: number;
}

export interface BudgetScenario {
  name: string;
  totalCost: number;
  profitMargin: number;
  riskLevel: 'low' | 'medium' | 'high';
  breakdown: BudgetBreakdown[];
}

export interface ProjectScope {
  requirements: string[];
  deliverables: Deliverable[];
  technicalRequirements: TechnicalRequirement[];
  additionalNotes?: string;
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

export interface ContractorAssignment {
  contractor: Contractor;
  status: 'pending' | 'confirmed' | 'declined';
  emailSent: boolean;
  responseDate?: string;
  notes?: string;
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed: boolean;
}

export interface Contractor {
  name: string;
  email: string;
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed: boolean;
}

export interface ProjectMetadata {
  category?: string;
  notes?: string;
  [key: string]: any;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  timeframe: Timeframe;
  budget: Budget;
  contractors: Contractor[];
  scope?: ProjectScope;
  metadata?: ProjectMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractorRate {
  id: string;
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  minBudget?: number;
  maxBudget?: number;
}

export interface ProjectSortOptions {
  field: 'title' | 'client' | 'status' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

// Form data interfaces for frontend use
export interface ProjectFormData {
  title: string;
  client: string;
  timeframe: Timeframe;
  budget: Budget;
  contractors: Contractor[];
  scope?: ProjectScope;
  selectedScenario?: BudgetScenario;
}
