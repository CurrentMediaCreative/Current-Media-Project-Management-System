export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER',
}

export enum ProjectStatus {
  NEW = 'new',
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export interface User {
  id: string;
  email: string;
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

export interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  timeframe: Timeframe;
  budget: Budget;
  contractors: Contractor[];
  scope?: ProjectScope;
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

export interface Invoice {
  id: string;
  projectId: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
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

export interface InvoiceFormData {
  projectId: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
}
