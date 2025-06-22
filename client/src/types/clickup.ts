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
  description?: string;
  status: {
    status: string;
    type: string;
    color: string;
  };
  parent?: string | null;
  date_created: string;
  date_updated: string;
  url: string;
  list: {
    id: string;
    name: string;
  };
  space: {
    id: string;
  };
  folder: {
    id: string;
  };
  customFields?: Record<string, any>;
  assignees?: {
    id: string;
    username: string;
    email: string;
  }[];
  tags?: {
    name: string;
    tag_fg: string;
    tag_bg: string;
  }[];
  dueDate?: string;
  startDate?: string;
  timeEstimate?: number;
  timeSpent?: number;
  priority?: {
    priority: string;
    color: string;
  };
  subtasks?: ClickUpTask[];
}

/**
 * Represents a task with its subtasks
 */
export interface TaskWithSubtasks extends ClickUpTask {
  subtasks: ClickUpTask[];
}

/**
 * Represents the relationships between tasks
 */
export interface TaskRelationships {
  parentTasks: TaskWithSubtasks[];
  taskRelationships: Map<string, ClickUpTask[]>;
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
