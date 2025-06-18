import api from '../shared/utils/api';

const updateNotificationStatus = async (id: string, status: 'READ' | 'ARCHIVED'): Promise<void> => {
  await api.put(`/dashboard/notifications/${id}/status`, { status });
};

const markAsRead = async (id: string): Promise<void> => {
  await api.put(`/dashboard/notifications/${id}/read`);
};

const clearNotification = async (id: string): Promise<void> => {
  await api.delete(`/dashboard/notifications/${id}`);
};

export const notificationService = {
  updateNotificationStatus,
  markAsRead,
  clearNotification,
};
