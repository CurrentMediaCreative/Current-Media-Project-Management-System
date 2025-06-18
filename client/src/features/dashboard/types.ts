import { MappedProject } from '@shared/types/clickup';

export type NotificationType = 
  | 'CONTRACTOR_CONFIRMATION'
  | 'CONTRACTOR_DECLINE'
  | 'PROJECT_NEW'
  | 'PROJECT_UPDATE'
  | 'CLICKUP_SYNC'
  | 'CLICKUP_UPDATE';

export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  message: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectStatusCount {
  newNotSent: number;
  newSent: number;
  activeInClickUp: number;
  completed: number;
  archived: number;
}

export interface ProjectsByStatus {
  newProjects: MappedProject[];
  activeProjects: MappedProject[];
  postProduction: MappedProject[];
  archived: MappedProject[];
}

export interface DashboardData {
  notifications: NotificationItem[];
  projectStatusCounts: ProjectStatusCount;
  projects: ProjectsByStatus;
}
