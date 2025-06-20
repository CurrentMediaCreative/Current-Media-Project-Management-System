import { LocalProject, CombinedProject, ProjectStatus } from '../types';

// Field name constants for ClickUp custom fields
export const CLICKUP_FIELD_NAMES = {
  CLIENT: 'Payee',
  TASK_TYPE: 'Task Type',
  INVOICE_STATUS: 'Project Payment',
  INVOICE_NUMBER: 'INV NUM'
} as const;

type ProjectType = LocalProject | CombinedProject;

// Helper function to get client name
export const getClientName = (project: ProjectType): string => {
  // If it's a local project, return the client field
  if ('client' in project && project.client) {
    return project.client;
  }
  
  // If it's a ClickUp synced project, check customFields
  if (isClickUpSynced(project) && project.clickUp?.customFields) {
    return (project.clickUp.customFields[CLICKUP_FIELD_NAMES.CLIENT] as string) || project.client || 'No Client';
  }

  return 'No Client';
};

// Helper function to get task type
export const getTaskType = (project: ProjectType): string => {
  if (isClickUpSynced(project) && project.clickUp?.customFields) {
    return (project.clickUp.customFields[CLICKUP_FIELD_NAMES.TASK_TYPE] as string) || 'Not Specified';
  }
  return 'Not Specified';
};

// Helper function to get invoice status
export const getInvoiceStatus = (project: ProjectType): string => {
  if (isClickUpSynced(project) && project.clickUp?.customFields) {
    return (project.clickUp.customFields[CLICKUP_FIELD_NAMES.INVOICE_STATUS] as string) || 'Not Set';
  }
  return 'Not Set';
};

// Helper function to get invoice number
export const getInvoiceNumber = (project: ProjectType): string | null => {
  if (isClickUpSynced(project) && project.clickUp?.customFields) {
    return (project.clickUp.customFields[CLICKUP_FIELD_NAMES.INVOICE_NUMBER] as string) || null;
  }
  return null;
};

// Type guard to check if a project has ClickUp data
export function isClickUpSynced(project: ProjectType): project is CombinedProject {
  return 'clickUp' in project && 
         project.clickUp !== undefined && 
         typeof project.clickUp.id === 'string' &&
         project.clickUp.id.length > 0;
}

// Helper to get the display status
export function getDisplayStatus(project: ProjectType): string {
  if (isClickUpSynced(project)) {
    // Return the raw ClickUp status for display
    return project.clickUp.status;
  }
  // For local projects, make the status more readable
  switch (project.status) {
    case ProjectStatus.NEW_NOT_SENT:
      return 'New (Not Sent)';
    case ProjectStatus.NEW_SENT:
      return 'New (Sent)';
    case ProjectStatus.ACTIVE:
      return 'Active';
    case ProjectStatus.COMPLETED:
      return 'Completed';
    case ProjectStatus.ARCHIVED:
      return 'Archived';
    default:
      return project.status;
  }
}
