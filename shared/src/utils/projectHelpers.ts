import { ProjectPageData } from '../types/project';

// Field name constants for ClickUp custom fields
export const CLICKUP_FIELD_NAMES = {
  CLIENT: 'Payee',
  TASK_TYPE: 'Task Type',
  INVOICE_STATUS: 'Project Payment',
  INVOICE_NUMBER: 'INV NUM'
} as const;

export function getClientName(project: ProjectPageData): string {
  if (project.local?.client) {
    return project.local.client;
  }
  
  if (project.clickUp?.customFields) {
    const clientField = project.clickUp.customFields[CLICKUP_FIELD_NAMES.CLIENT];
    if (typeof clientField === 'string') {
      return clientField;
    }
  }
  
  return 'Unknown Client';
}
