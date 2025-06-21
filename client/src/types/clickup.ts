/**
 * ClickUp Types
 * 
 * These types represent read-only data from ClickUp.
 * They are used to display project information from ClickUp,
 * but never for modifying ClickUp data. All modifications
 * are handled locally in our own system.
 */

/**
 * Represents a read-only task from ClickUp
 * Used for displaying task information, never for updates
 */
export interface ClickUpTask {
  id: string;
  name: string;
  status?: {
    status: string;
    color: string;
  };
  url?: string;
  date_created?: string;
  date_updated?: string;
  custom_fields?: ClickUpCustomField[];
}

/**
 * Represents a read-only custom field from ClickUp
 * Used for displaying field information, never for updates
 */
export interface ClickUpCustomField {
  id: string;
  name: string;
  type: string;
  type_config: {
    options?: ClickUpCustomFieldOption[];
  };
  value: string | number | null;
}

/**
 * Represents a read-only custom field option from ClickUp
 * Used for displaying option information, never for updates
 */
export interface ClickUpCustomFieldOption {
  id: string;
  name: string;
  orderindex: number;
  color?: string;
}

/**
 * Constants for mapping ClickUp field names to our system
 * These are used to extract information from ClickUp fields
 * for display purposes only
 */
export const CLICKUP_FIELD_NAMES = {
  CLIENT: 'client',
  INVOICE_NUMBER: 'invoice_number',
  INVOICE_STATUS: 'invoice_status',
  TASK_TYPE: 'task_type',
  BUDGET: 'budget'
} as const;
