import { ProjectCreationStep } from './types';

// Export components
export { default as ProjectCreationFlow } from './ProjectCreationFlow';
export { default as InitialProjectInfo } from './InitialProjectInfo';
export { default as ScopeDefinition } from './ScopeDefinition';
export { default as SmartBudgetSystem } from './SmartBudgetSystem';
export { default as ContractorManagement } from '../contractor-management/ContractorManagement';
export { default as ProductionOverview } from './ProductionOverview';

// Export project creation steps
export const PROJECT_CREATION_STEPS: Array<{
  id: ProjectCreationStep;
  label: string;
}> = [
  {
    id: 'initial-info',
    label: 'Initial Project Info'
  },
  {
    id: 'scope-definition',
    label: 'Scope Definition'
  },
  {
    id: 'budget-system',
    label: 'Smart Budget System'
  },
  {
    id: 'contractor-management',
    label: 'Contractor Management'
  },
  {
    id: 'production-overview',
    label: 'Production Overview'
  }
];
