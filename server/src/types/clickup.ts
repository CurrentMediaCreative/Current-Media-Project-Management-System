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
  title: string;
  client: string;
  status: ProjectStatus;
  timeframe: {
    startDate: string;
    endDate: string;
  };
  budget: {
    estimated: number;
    actual: number;
  };
  contractors: Array<{
    name: string;
    email: string;
    role: string;
    baseRate: number;
    chargeOutRate: number;
    isFixed: boolean;
  }>;
  metadata?: {
    category?: string;
    notes?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
  clickUp: {
    id: string;
    name: string;
    status: string;
    statusColor: string;
    url: string;
    customFields: {
      [key: string]: string | number | null;
    };
  };
}
