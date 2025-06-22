import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchLocalProjectsStart,
  fetchLocalProjectsSuccess,
  fetchLocalProjectsFailure,
  fetchClickUpProjectsStart,
  fetchClickUpProjectsSuccess,
  fetchClickUpProjectsFailure,
  updateMatches,
  selectPollingConfig,
  selectCacheStatus,
  selectLoading,
  selectErrors
} from '../../../../store/slices/projectSlice';
import { projectService } from '../../../../services/projectService';
import { clickupService } from '../../../../services/clickupService';
import { LocalProject, ClickUpData, matchProjectNames } from '../../../../types/project';

export const useProjectData = () => {
  const dispatch = useDispatch();
  const pollingConfig = useSelector(selectPollingConfig);
  const cacheStatus = useSelector(selectCacheStatus);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);

  const mapTaskToClickUpData = (task: any): ClickUpData => ({
    id: task.id,
    name: task.name,
    status: task.status.status,
    statusColor: task.status.color,
    url: task.url,
    dateCreated: task.date_created,
    dateUpdated: task.date_updated,
    customFields: task.customFields || {},
    subtasks: task.subtasks ? task.subtasks.map(mapTaskToClickUpData) : undefined
  });

  // Function to fetch both local and ClickUp data
  const fetchAllData = async () => {
    try {
      // Load local projects
      dispatch(fetchLocalProjectsStart());
      const projectData = await projectService.getProjects();
      const localProjects = projectData
        .filter((p): p is { local: LocalProject } => p.local !== undefined)
        .map(p => p.local);
      dispatch(fetchLocalProjectsSuccess(localProjects));

      // Load ClickUp projects with relationships
      dispatch(fetchClickUpProjectsStart());
      const { parentTasks } = await clickupService.getTasks();
      const clickUpProjects: ClickUpData[] = parentTasks.map(mapTaskToClickUpData);
      dispatch(fetchClickUpProjectsSuccess(clickUpProjects));

      // Update matches based on project names
      const newMatches: Record<string, string> = {};
      localProjects.forEach(localProject => {
        const matchingClickUpProject = clickUpProjects.find(clickUpProject => 
          matchProjectNames(localProject.title, clickUpProject.name)
        );
        if (matchingClickUpProject) {
          newMatches[localProject.id] = matchingClickUpProject.id;
        }
      });
      dispatch(updateMatches(newMatches));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(fetchLocalProjectsFailure(err.message));
        dispatch(fetchClickUpProjectsFailure(err.message));
      }
    }
  };

  // Function to fetch only ClickUp data (for polling)
  const fetchClickUpData = async () => {
    try {
      dispatch(fetchClickUpProjectsStart());
      const { parentTasks } = await clickupService.getTasks();
      const clickUpProjects: ClickUpData[] = parentTasks.map(mapTaskToClickUpData);
      dispatch(fetchClickUpProjectsSuccess(clickUpProjects));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(fetchClickUpProjectsFailure(err.message));
      }
    }
  };

  // Effect for initial data load and polling setup
  useEffect(() => {
    // Initial data load
    fetchAllData();

    // Set up polling if enabled
    let pollInterval: NodeJS.Timeout | null = null;
    if (pollingConfig.enabled) {
      pollInterval = setInterval(() => {
        // Only fetch if cache is stale
        if (cacheStatus.stale) {
          fetchClickUpData();
        }
      }, pollingConfig.interval);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [dispatch, pollingConfig.enabled, pollingConfig.interval]);

  return {
    loading,
    errors,
    cacheStatus,
    refetch: fetchAllData,
    refetchClickUp: fetchClickUpData
  };
};
