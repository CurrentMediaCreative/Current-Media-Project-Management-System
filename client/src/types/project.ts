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

// Project page data - can have local data, ClickUp data, or both
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

// Helper function to check if a project has matching ClickUp data
export function hasClickUpData(project: ProjectPageData): boolean {
  return project.clickUp !== undefined;
}

// Helper function to check if a project has local data
export function hasLocalData(project: ProjectPageData): boolean {
  return project.local !== undefined;
}

// Helper function to match local and ClickUp projects by name
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

export interface StepProps {
  data: ProjectFormData;
  onUpdate: (data: Partial<ProjectFormData>) => void;
}

export interface InitialProjectInfoProps {
  onSave: (data: ProjectFormData) => void;
  initialData?: ProjectFormData;
  errors?: Record<string, string>;
  loading?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

export interface ScopeDefinitionProps {
  onSave: (scope: ProjectScope) => void;
  initialData?: ProjectScope;
  errors?: Record<string, string>;
  loading?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

export interface SmartBudgetSystemProps {
  onComplete: (data: {
    selectedScenario: BudgetScenario;
    profitTarget: number;
    contingencyPercentage: number;
  }) => void;
  initialData?: {
    estimatedBudget?: number;
    timeframe?: Timeframe;
    selectedScenario?: BudgetScenario;
  };
  errors?: Record<string, string>;
  loading?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

export interface ContractorManagementProps {
  onComplete: (assignments: ContractorAssignment[]) => void;
  initialData?: {
    contractors?: Contractor[];
    budget?: ProjectCreationBudget;
    projectTitle?: string;
  };
  errors?: Record<string, string>;
  loading?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

export interface ProductionOverviewProps {
  onComplete: () => void;
  projectData: ProjectFormData;
  errors?: Record<string, string>;
  loading?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}
