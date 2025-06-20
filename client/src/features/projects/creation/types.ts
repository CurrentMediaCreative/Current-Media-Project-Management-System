import { ProjectScope, Contractor } from '../../../types/project';

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
    profitTarget?: number;
    contingencyPercentage?: number;
  };
  contractors: Contractor[];
  scope?: ProjectScope;
}

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
    timeframe?: {
      startDate: string;
      endDate: string;
    };
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
    budget?: {
      estimated: number;
      actual: number;
      profitTarget?: number;
      contingencyPercentage?: number;
    };
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
