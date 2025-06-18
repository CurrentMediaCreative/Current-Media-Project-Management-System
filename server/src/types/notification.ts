export interface Notification {
  id: string;
  type: 'CONTRACTOR_CONFIRMATION' | 'CONTRACTOR_DECLINE' | 'PROJECT_NEW' | 'PROJECT_UPDATE' | 'CLICKUP_SYNC' | 'CLICKUP_UPDATE';
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}
