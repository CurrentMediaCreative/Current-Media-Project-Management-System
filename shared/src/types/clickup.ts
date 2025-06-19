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

export interface ClickUpCustomField {
  id: string;
  name: string;
  type: string;
  type_config: {
    options?: ClickUpCustomFieldOption[];
  };
  value: string | number | null;
}

export interface ClickUpCustomFieldOption {
  id: string;
  name: string;
  orderindex: number;
  color?: string;
}

export interface ClickUpSpace {
  id: string;
  name: string;
  private: boolean;
  statuses: ClickUpStatus[];
  features: Record<string, any>;
}

export interface ClickUpList {
  id: string;
  name: string;
  content: string;
  task_count: number;
  archived: boolean;
  space: ClickUpSpace;
}

export interface ClickUpStatus {
  id: string;
  status: string;
  type: string;
  orderindex: number;
  color: string;
}

export interface MappedProject {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  createdAt: Date;
  updatedAt: Date;
  clickUpUrl: string;
  customFields: {
    [key: string]: string | number | null;
  };
}

import { ProjectStatus } from './index';

// ClickUp field mapping constants
export const CLICKUP_FIELD_MAPPING = {
  CLIENT: 'ace9e6da-73ff-48ec-add3-9aab92f518ab', // Payee field
  INVOICE_NUMBER: '08cd5c39-b63b-4038-82f7-44d6bfde8365', // INV NUM field
  INVOICE_STATUS: '2ad4690f-9229-4491-bf9f-a7d07436c78d', // Project Payment field
  TASK_TYPE: null // Removed as this field is not currently used
} as const;
