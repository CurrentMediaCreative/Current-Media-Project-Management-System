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

// ClickUp field mapping constants
export const CLICKUP_FIELD_NAMES = {
  CLIENT: 'client',
  INVOICE_NUMBER: 'invoice_number',
  INVOICE_STATUS: 'invoice_status',
  TASK_TYPE: 'task_type'
} as const;
