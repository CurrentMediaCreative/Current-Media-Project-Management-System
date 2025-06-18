import api from '../shared/utils/api';
import { DashboardData } from '../features/dashboard/types';

const getDashboardData = async (): Promise<DashboardData> => {
  const [overviewResponse, notificationsResponse] = await Promise.all([
    api.get('/dashboard/overview'),
    api.get('/dashboard/notifications')
  ]);

  return {
    ...overviewResponse.data,
    notifications: notificationsResponse.data.map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
      expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
      // Don't parse metadata if it's already an object
      metadata: typeof n.metadata === 'string' ? JSON.parse(n.metadata) : n.metadata
    }))
  };
};

const updateNotificationStatus = async (id: string, status: 'READ' | 'ARCHIVED'): Promise<void> => {
  await api.put(`/dashboard/notifications/${id}/status`, { status });
};

const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.put(`/dashboard/notifications/${id}/read`);
};

const archiveNotification = async (id: string): Promise<void> => {
  await updateNotificationStatus(id, 'ARCHIVED');
};

const clearNotification = async (id: string): Promise<void> => {
  await api.delete(`/dashboard/notifications/${id}`);
};

export const dashboardService = {
  getDashboardData,
  markNotificationAsRead,
  archiveNotification,
  clearNotification,
  updateNotificationStatus,
};
