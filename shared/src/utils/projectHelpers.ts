import { Project } from '../types';

// Field name constants for ClickUp custom fields
export const CLICKUP_FIELD_NAMES = {
  CLIENT: 'Payee',
  TASK_TYPE: 'Task Type',
  INVOICE_STATUS: 'Project Payment',
  INVOICE_NUMBER: 'INV NUM'
} as const;

// Helper function to get client name from either Project or MappedProject
export const getClientName = (project: Project | { customFields: { [key: string]: string | number | null } }): string => {
  if ('customFields' in project && project.customFields) {
    return (project.customFields[CLICKUP_FIELD_NAMES.CLIENT] as string) || 'No Client';
  }
  return 'No Client';
};

// Helper function to get task type
export const getTaskType = (project: Project | { customFields: { [key: string]: string | number | null } }): string => {
  if ('customFields' in project && project.customFields) {
    return (project.customFields[CLICKUP_FIELD_NAMES.TASK_TYPE] as string) || 'Not Specified';
  }
  return 'Not Specified';
};

// Helper function to get invoice status
export const getInvoiceStatus = (project: Project | { customFields: { [key: string]: string | number | null } }): string => {
  if ('customFields' in project && project.customFields) {
    return (project.customFields[CLICKUP_FIELD_NAMES.INVOICE_STATUS] as string) || 'Not Set';
  }
  return 'Not Set';
};

// Helper function to get invoice number
export const getInvoiceNumber = (project: Project | { customFields: { [key: string]: string | number | null } }): string | null => {
  if ('customFields' in project && project.customFields) {
    return (project.customFields[CLICKUP_FIELD_NAMES.INVOICE_NUMBER] as string) || null;
  }
  return null;
};
