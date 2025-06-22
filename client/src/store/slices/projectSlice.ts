import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalProject, ProjectScope, Contractor, ProjectStatus, ProjectPageData, ClickUpData } from '../../types/project';
import { RootState } from '../index';
import { NotificationItem } from '../../features/dashboard/types';

interface ProjectState {
  notifications: {
    items: NotificationItem[];
    loading: boolean;
    error: string | null;
  };
  localProjects: {
    byId: Record<string, LocalProject>;
    allIds: string[];
    lastUpdated: number | null;
  };
  clickUpProjects: {
    byId: Record<string, ClickUpData>;
    allIds: string[];
    lastFetched: number | null;
    polling: {
      enabled: boolean;
      interval: number;
      lastError: string | null;
    };
    cache: {
      duration: number; // milliseconds
      stale: boolean;
    };
  };
  matches: Record<string, string>; // localProjectId -> clickUpTaskId
  currentProject: {
    id: string | null;
    type: 'local' | 'clickup' | null;
  };
  loading: {
    local: boolean;
    clickUp: boolean;
  };
  error: {
    local: string | null;
    clickUp: string | null;
  };
  filters: {
    status: ProjectStatus[];
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
}

const initialState: ProjectState = {
  notifications: {
    items: [],
    loading: false,
    error: null,
  },
  localProjects: {
    byId: {},
    allIds: [],
    lastUpdated: null,
  },
  clickUpProjects: {
    byId: {},
    allIds: [],
    lastFetched: null,
    polling: {
      enabled: true,
      interval: 30000, // 30 seconds
      lastError: null,
    },
    cache: {
      duration: 300000, // 5 minutes
      stale: false,
    },
  },
  matches: {},
  currentProject: {
    id: null,
    type: null,
  },
  loading: {
    local: false,
    clickUp: false,
  },
  error: {
    local: null,
    clickUp: null,
  },
  filters: {
    status: [],
    dateRange: {
      start: null,
      end: null,
    },
  },
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Local project actions
    fetchLocalProjectsStart: (state) => {
      state.loading.local = true;
      state.error.local = null;
    },
    fetchLocalProjectsSuccess: (state, action: PayloadAction<LocalProject[]>) => {
      state.loading.local = false;
      state.localProjects.byId = action.payload.reduce((acc, project) => {
        acc[project.id] = project;
        return acc;
      }, {} as Record<string, LocalProject>);
      state.localProjects.allIds = action.payload.map(p => p.id);
    },
    fetchLocalProjectsFailure: (state, action: PayloadAction<string>) => {
      state.loading.local = false;
      state.error.local = action.payload;
    },

    // ClickUp project actions
    fetchClickUpProjectsStart: (state) => {
      state.loading.clickUp = true;
      state.error.clickUp = null;
    },
    fetchClickUpProjectsSuccess: (state, action: PayloadAction<ClickUpData[]>) => {
      state.loading.clickUp = false;
      state.clickUpProjects.byId = action.payload.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {} as Record<string, ClickUpData>);
      state.clickUpProjects.allIds = action.payload.map(t => t.id);
      state.clickUpProjects.lastFetched = Date.now();
    },
    fetchClickUpProjectsFailure: (state, action: PayloadAction<string>) => {
      state.loading.clickUp = false;
      state.error.clickUp = action.payload;
      state.clickUpProjects.polling.lastError = action.payload;
    },

    // Polling actions
    setPollingEnabled: (state, action: PayloadAction<boolean>) => {
      state.clickUpProjects.polling.enabled = action.payload;
    },
    setPollingInterval: (state, action: PayloadAction<number>) => {
      state.clickUpProjects.polling.interval = action.payload;
    },
    clearPollingError: (state) => {
      state.clickUpProjects.polling.lastError = null;
    },

    // Matching actions
    updateMatches: (state, action: PayloadAction<Record<string, string>>) => {
      state.matches = action.payload;
    },
    addMatch: (state, action: PayloadAction<{ localId: string; clickUpId: string }>) => {
      state.matches[action.payload.localId] = action.payload.clickUpId;
    },
    removeMatch: (state, action: PayloadAction<string>) => {
      delete state.matches[action.payload];
    },

    // Current project actions
    setCurrentProject: (state, action: PayloadAction<{ id: string; type: 'local' | 'clickup' }>) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = { id: null, type: null };
    },

    // Project update actions
    updateLocalProject: (state, action: PayloadAction<LocalProject>) => {
      state.localProjects.byId[action.payload.id] = action.payload;
      if (!state.localProjects.allIds.includes(action.payload.id)) {
        state.localProjects.allIds.push(action.payload.id);
      }
    },
    updateClickUpProject: (state, action: PayloadAction<ClickUpData>) => {
      state.clickUpProjects.byId[action.payload.id] = action.payload;
      if (!state.clickUpProjects.allIds.includes(action.payload.id)) {
        state.clickUpProjects.allIds.push(action.payload.id);
      }
    },

    // Filter actions
    setFilters: (state, action: PayloadAction<{
      status?: ProjectStatus[];
      dateRange?: { start: string | null; end: string | null };
    }>) => {
      if (action.payload.status !== undefined) {
        state.filters.status = action.payload.status;
      }
      if (action.payload.dateRange !== undefined) {
        state.filters.dateRange = action.payload.dateRange;
      }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Error actions
    clearErrors: (state) => {
      state.error.local = null;
      state.error.clickUp = null;
      state.clickUpProjects.polling.lastError = null;
    },

    // Notification actions
    fetchNotificationsStart: (state) => {
      state.notifications.loading = true;
      state.notifications.error = null;
    },
    fetchNotificationsSuccess: (state, action: PayloadAction<NotificationItem[]>) => {
      state.notifications.loading = false;
      state.notifications.items = action.payload;
      state.notifications.error = null;
    },
    fetchNotificationsFailure: (state, action: PayloadAction<string>) => {
      state.notifications.loading = false;
      state.notifications.error = action.payload;
    },
    clearNotification: (state, action: PayloadAction<string>) => {
      state.notifications.items = state.notifications.items.filter(n => n.id !== action.payload);
    },
  },
});

export const {
  // Local project actions
  fetchLocalProjectsStart,
  fetchLocalProjectsSuccess,
  fetchLocalProjectsFailure,
  // ClickUp project actions
  fetchClickUpProjectsStart,
  fetchClickUpProjectsSuccess,
  fetchClickUpProjectsFailure,
  // Polling actions
  setPollingEnabled,
  setPollingInterval,
  clearPollingError,
  // Matching actions
  updateMatches,
  addMatch,
  removeMatch,
  // Current project actions
  setCurrentProject,
  clearCurrentProject,
  // Project update actions
  updateLocalProject,
  updateClickUpProject,
  // Filter actions
  setFilters,
  clearFilters,
  // Error actions
  clearErrors,
  // Notification actions
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  clearNotification,
} = projectSlice.actions;

// Selectors
export const selectLocalProjects = (state: RootState) => 
  state.projects.localProjects.allIds.map(id => state.projects.localProjects.byId[id]);

export const selectClickUpProjects = (state: RootState) =>
  state.projects.clickUpProjects.allIds.map(id => state.projects.clickUpProjects.byId[id]);

export const selectMatches = (state: RootState) => state.projects.matches;

export const selectCurrentProject = (state: RootState) => {
  const { id, type } = state.projects.currentProject;
  if (!id || !type) return null;

  return type === 'local' 
    ? state.projects.localProjects.byId[id]
    : state.projects.clickUpProjects.byId[id];
};

export const selectMatchedProjects = (state: RootState) => {
  const matches = state.projects.matches;
  return Object.entries(matches).map(([localId, clickUpId]) => ({
    local: state.projects.localProjects.byId[localId],
    clickUp: state.projects.clickUpProjects.byId[clickUpId],
  }));
};

// New selectors for the simplified architecture
export const selectAllProjects = (state: RootState) => {
  const localProjects = selectLocalProjects(state);
  const clickUpProjects = selectClickUpProjects(state);
  const matches = state.projects.matches;

  return {
    matched: Object.entries(matches).map(([localId, clickUpId]) => ({
      id: localId,
      local: state.projects.localProjects.byId[localId],
      clickUp: state.projects.clickUpProjects.byId[clickUpId],
      type: 'matched' as const,
    })),
    unmatched: {
      local: localProjects.filter(p => !Object.keys(matches).includes(p.id)).map(p => ({
        id: p.id,
        local: p,
        clickUp: null,
        type: 'local' as const,
      })),
      clickUp: clickUpProjects.filter(p => !Object.values(matches).includes(p.id)).map(p => ({
        id: p.id,
        local: null,
        clickUp: p,
        type: 'clickup' as const,
      })),
    },
  };
};

export const selectFilteredProjects = (state: RootState) => {
  const allProjects = selectAllProjects(state);
  const { status: statusFilters, dateRange } = state.projects.filters;

  const filterByStatus = (project: any) => {
    if (statusFilters.length === 0) return true;
    const status = project.clickUp?.status.status || project.local?.status;
    return status && statusFilters.includes(status);
  };

  const filterByDate = (project: any) => {
    if (!dateRange.start && !dateRange.end) return true;
    const date = project.clickUp?.date_updated || project.local?.updatedAt;
    if (!date) return false;

    const projectDate = new Date(date).getTime();
    const start = dateRange.start ? new Date(dateRange.start).getTime() : 0;
    const end = dateRange.end ? new Date(dateRange.end).getTime() : Infinity;

    return projectDate >= start && projectDate <= end;
  };

  return {
    matched: allProjects.matched.filter(p => filterByStatus(p) && filterByDate(p)),
    unmatched: {
      local: allProjects.unmatched.local.filter(p => filterByStatus(p) && filterByDate(p)),
      clickUp: allProjects.unmatched.clickUp.filter(p => filterByStatus(p) && filterByDate(p)),
    },
  };
};

export const selectCacheStatus = (state: RootState) => {
  const { lastFetched, cache } = state.projects.clickUpProjects;
  if (!lastFetched) return { stale: true, age: Infinity };

  const age = Date.now() - lastFetched;
  return {
    stale: age > cache.duration,
    age,
  };
};

export const selectPollingConfig = (state: RootState) => state.projects.clickUpProjects.polling;

export const selectLoading = (state: RootState) => state.projects.loading;

export const selectErrors = (state: RootState) => state.projects.error;

// Notification selectors
export const selectNotifications = (state: RootState) => state.projects.notifications.items;
export const selectNotificationsLoading = (state: RootState) => state.projects.notifications.loading;
export const selectNotificationsError = (state: RootState) => state.projects.notifications.error;

export default projectSlice.reducer;
