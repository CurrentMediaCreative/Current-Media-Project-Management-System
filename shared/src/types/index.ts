// Project Types
export interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  scope: string;
  timeframe: {
    startDate: Date;
    endDate: Date;
  };
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

// Budget Types
export interface Budget {
  id: string;
  projectId: string;
  estimatedCosts: BudgetItem[];
  actualCosts: BudgetItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface ProjectFormData {
  name: string;
  client: string;
  budget: number;
  scope: string;
  timeframe: {
    startDate: Date;
    endDate: Date;
  };
}

export interface BudgetFormData {
  projectId: string;
  items: {
    category: string;
    description: string;
    amount: number;
  }[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
}

export enum NotificationType {
  REMINDER = 'reminder',
  UPDATE = 'update',
  ALERT = 'alert',
}
