import { ProjectStatus } from './index';

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
    precision?: number;
    currency_type?: string;
    options?: ClickUpCustomFieldOption[];
  };
  date_created: string;
  hide_from_guests: boolean;
  required?: boolean;
  value: string | number | null;
}

export interface ClickUpCustomFieldOption {
  id: string;
  name?: string;
  label?: string;
  color?: string;
  orderindex?: number;
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
  status: ProjectStatus;
  statusColor: string;
  client: string | null;
  taskType: string | null;
  invoiceStatus: string | null;
  invoiceNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  clickUpUrl: string;
}

// ClickUp field mapping constants
export const CLICKUP_FIELD_MAPPING = {
  CLIENT: 'custom_field_client_id',
  TASK_TYPE: 'custom_field_type_id',
  INVOICE_STATUS: 'custom_field_invoice_status_id',
  INVOICE_NUMBER: 'custom_field_invoice_number_id'
} as const;
