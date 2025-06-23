/**
 * Project Types
 * 
 * This file contains types for our project management system.
 * There is a clear separation between local project data that we can modify
 * and read-only ClickUp data that we only display.
 */

/**
 * Local project statuses that we manage in our system.
 * These are independent of ClickUp statuses which are read-only.
 */
export enum ProjectStatus {
  NEW_NOT_SENT = 'new_not_sent',
  NEW_SENT = 'new_sent',
  PENDING_CLICKUP = 'pending_clickup',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface Budget {
  estimated: number;
  actual: number;
  profitTarget?: number;
  contingencyPercentage?: number;
}

export interface ProjectMetadata {
  category?: string;
  notes?: string;
  // Allow common metadata value types but not 'any'
  [key: string]: string | number | boolean | Date | object | undefined;
}

/**
 * Represents a project in our local system.
 * This is the data we can modify and manage independently of ClickUp.
 */
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
  clickUpId?: string;
  folderPath?: string;
  documents?: string[];
}

/**
 * Represents read-only data from ClickUp.
 * This data is only for display purposes and cannot be modified.
 */
export interface ClickUpData {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  url: string;
  dateCreated?: string;
  dateUpdated?: string;
  customFields: {
    [key: string]: string | number | null;
  };
  subtasks?: ClickUpData[];
}

/**
 * Combined project data structure.
 * - local: Our system's data that we can modify
 * - clickUp: Read-only data from ClickUp for display purposes
 * A project can have either local data, ClickUp data, or both
 */
export interface ProjectPageData {
  local?: LocalProject;
  clickUp?: ClickUpData;
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

export interface Contractor {
  name: string;
  email: string;
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed: boolean;
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
  field: keyof LocalProject;
  direction: 'asc' | 'desc';
}

/**
 * Helper function to check if a project has associated read-only ClickUp data
 */
export function hasClickUpData(project: ProjectPageData): boolean {
  return project.clickUp !== undefined;
}

/**
 * Helper function to check if a project has local data that we can modify
 */
export function hasLocalData(project: ProjectPageData): boolean {
  return project.local !== undefined;
}

/**
 * Helper function to match local and ClickUp projects by name
 * Used for display purposes to associate our local data with read-only ClickUp data
 */
export function matchProjectNames(localName: string, clickUpName: string): boolean {
  return localName.toLowerCase() === clickUpName.toLowerCase();
}

// Project Creation Types
export interface ProjectCreationBudget {
  estimated: number;
  actual: number;
  profitTarget: number;
  contingencyPercentage: number;
}

export interface Timeframe {
  startDate: string;
  endDate: string;
}

export interface ProjectFormData extends Omit<Pick<LocalProject, 'title' | 'client' | 'timeframe' | 'contractors'>, 'budget'> {
  budget: ProjectCreationBudget;
  scope?: ProjectScope;
  selectedScenario?: BudgetScenario;
}

export interface BudgetScenario {
  id?: string;
  name: string;
  totalCost: number;
  profitMargin: number;
  riskLevel: 'low' | 'medium' | 'high';
  breakdown: BudgetBreakdown[];
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  percentage?: number;
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

export type ProjectCreationStep = 
  | 'initial-info'
  | 'scope-definition'
  | 'budget-system'
  | 'contractor-management'
  | 'production-overview';

// Server-side project types
export interface CreateProjectInput {
  name: string;
  status: string;
  description?: string;
  budget?: number;
  predictedCosts?: number;
  actualCosts?: number;
  startDate?: Date;
  endDate?: Date;
  clickUpId?: string;
  folderPath?: string;
  documents?: string[];
}

export interface UpdateProjectInput {
  name?: string;
  status?: string;
  description?: string;
  budget?: number;
  predictedCosts?: number;
  actualCosts?: number;
  startDate?: Date;
  endDate?: Date;
  clickUpId?: string;
  folderPath?: string;
  documents?: string[];
}

export interface ProjectStats {
  totalProjects: number;
  projectsByStatus: Record<string, number>;
  totalBudget: number;
  totalPredictedCosts: number;
  totalActualCosts: number;
  averageProjectDuration: number;
  completionRate: number;
}
