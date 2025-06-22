import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectFilteredProjects,
  selectCacheStatus,
  selectLoading,
  selectErrors,
  selectPollingConfig,
  selectNotifications,
  selectNotificationsLoading,
  selectNotificationsError,
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  clearNotification as clearNotificationAction
} from '../../../store/slices/projectSlice';
import { DashboardData, NotificationItem } from '../types';
import { dashboardService } from '../../../services/dashboardService';
import { useProjectData } from '../../projects/tracking/hooks/useProjectData';
import { ProjectPageData, ProjectStatus } from '../../../types/project';

export const useDashboardData = () => {
  const dispatch = useDispatch();
  const filteredProjects = useSelector(selectFilteredProjects);
  const cacheStatus = useSelector(selectCacheStatus);

  // Redux selectors
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  const pollingConfig = useSelector(selectPollingConfig);

  // Get notifications from Redux
  const notifications = useSelector(selectNotifications);
  const notificationsLoading = useSelector(selectNotificationsLoading);
  const notificationsError = useSelector(selectNotificationsError);

  // Use project data hook for data fetching
  const { refetch, refetchClickUp } = useProjectData();

  // Calculate project status counts
  const projectStatusCounts = {
    newNotSent: 0,
    newSent: 0,
    activeInClickUp: 0,
    completed: 0,
    archived: 0
  };

  // Helper function to categorize projects
  const categorizeProjects = () => {
    const newProjects: ProjectPageData[] = [];
    const activeProjects: ProjectPageData[] = [];
    const postProduction: ProjectPageData[] = [];
    const archived: ProjectPageData[] = [];

    // Process matched projects
    filteredProjects.matched.forEach(p => {
      const project: ProjectPageData = {
        local: p.local ? { ...p.local } : undefined,
        clickUp: p.clickUp ? { ...p.clickUp } : undefined
      };

      const status = p.clickUp?.status || p.local?.status;
      
      if (status === ProjectStatus.NEW_NOT_SENT) {
        projectStatusCounts.newNotSent++;
        newProjects.push(project);
      } else if (status === ProjectStatus.NEW_SENT) {
        projectStatusCounts.newSent++;
        newProjects.push(project);
      } else if (status === ProjectStatus.ACTIVE || status === 'IN_PROGRESS') {
        projectStatusCounts.activeInClickUp++;
        activeProjects.push(project);
      } else if (status === ProjectStatus.COMPLETED || status === 'POST_PRODUCTION') {
        projectStatusCounts.completed++;
        postProduction.push(project);
      } else if (status === ProjectStatus.ARCHIVED) {
        projectStatusCounts.archived++;
        archived.push(project);
      }
    });

    // Process unmatched local projects
    filteredProjects.unmatched.local.forEach(p => {
      const project: ProjectPageData = {
        local: p.local ? { ...p.local } : undefined,
        clickUp: undefined
      };

      if (p.local?.status === ProjectStatus.NEW_NOT_SENT) {
        projectStatusCounts.newNotSent++;
        newProjects.push(project);
      } else if (p.local?.status === ProjectStatus.NEW_SENT) {
        projectStatusCounts.newSent++;
        newProjects.push(project);
      }
    });

    // Process unmatched ClickUp projects
    filteredProjects.unmatched.clickUp.forEach(p => {
      const project: ProjectPageData = {
        local: undefined,
        clickUp: p.clickUp ? { ...p.clickUp } : undefined
      };

      const status = p.clickUp?.status;
      if (status === 'ACTIVE' || status === 'IN_PROGRESS') {
        projectStatusCounts.activeInClickUp++;
        activeProjects.push(project);
      } else if (status === 'COMPLETED' || status === 'POST_PRODUCTION') {
        projectStatusCounts.completed++;
        postProduction.push(project);
      } else if (status === 'ARCHIVED') {
        projectStatusCounts.archived++;
        archived.push(project);
      }
    });

    return {
      newProjects,
      activeProjects,
      postProduction,
      archived
    };
  };

  // Load notifications from Redux
  useEffect(() => {
    let mounted = true;
    
    const loadNotifications = async () => {
      if (!mounted) return;
      
      try {
        dispatch(fetchNotificationsStart());
        const data = await dashboardService.getDashboardData();
        if (mounted) {
          dispatch(fetchNotificationsSuccess(data.notifications));
        }
      } catch (err) {
        if (mounted) {
          dispatch(fetchNotificationsFailure('Failed to load notifications'));
          console.error('Notifications error:', err);
        }
      }
    };

    loadNotifications();
    return () => { mounted = false; };
  }, [dispatch]);

  // Clear a notification using Redux
  const clearNotification = async (id: string) => {
    try {
      await dashboardService.clearNotification(id);
      dispatch(clearNotificationAction(id));
    } catch (err) {
      console.error('Failed to clear notification:', err);
      throw err;
    }
  };

  const categorizedProjects = categorizeProjects();

  const dashboardData: DashboardData = {
    projects: categorizedProjects,
    projectStatusCounts,
    notifications
  };

  return {
    dashboardData,
    loading: {
      projects: loading.local || loading.clickUp,
      notifications: notificationsLoading
    },
    errors: {
      projects: errors.local || errors.clickUp,
      notifications: notificationsError
    },
    cacheStatus,
    pollingConfig,
    refetch,
    refetchClickUp,
    clearNotification
  };
};
