export interface ClickUpTask {
  id: string;
  name: string;
  description?: string;
  status: {
    status: string;
    type: string;
  };
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
}

export interface ClickUpWorkspace {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  members: {
    user: {
      id: string;
      username: string;
      email: string;
    };
    role: number;
  }[];
}

export interface ClickUpSpace {
  id: string;
  name: string;
  private: boolean;
  statuses: {
    id: string;
    status: string;
    type: string;
    orderindex: number;
    color: string;
  }[];
  multiple_assignees: boolean;
  features: {
    due_dates: boolean;
    time_tracking: boolean;
    tags: boolean;
    time_estimates: boolean;
    checklists: boolean;
    custom_fields: boolean;
    remap_dependencies: boolean;
    dependency_warning: boolean;
    portfolios: boolean;
  };
}

export interface ClickUpList {
  id: string;
  name: string;
  orderindex: number;
  content: string;
  status: {
    status: string;
    color: string;
    hide_label: boolean;
  };
  priority: {
    priority: string;
    color: string;
  };
  assignee: string | null;
  task_count: number;
  due_date: string | null;
  start_date: string | null;
  folder: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  space: {
    id: string;
    name: string;
    access: boolean;
  };
  archived: boolean;
  override_statuses: boolean;
  permission_level: string;
}

// Alias for backward compatibility
export type ClickUpData = ClickUpTask;
