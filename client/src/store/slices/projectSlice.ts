import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectScope, Contractor, ProjectStatus } from '../../shared/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: ProjectStatus[];
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
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
    fetchProjectsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProjectsSuccess: (state, action: PayloadAction<Project[]>) => {
      state.loading = false;
      state.projects = action.payload;
    },
    fetchProjectsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    updateProjectStatus: (state, action: PayloadAction<{ projectId: string; status: ProjectStatus }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.status = action.payload.status;
      }
      if (state.currentProject?.id === action.payload.projectId) {
        state.currentProject.status = action.payload.status;
      }
    },
    updateProjectContractors: (state, action: PayloadAction<{ projectId: string; contractors: Contractor[] }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.contractors = action.payload.contractors;
      }
      if (state.currentProject?.id === action.payload.projectId) {
        state.currentProject.contractors = action.payload.contractors;
      }
    },
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
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  setCurrentProject,
  clearCurrentProject,
  updateProjectStatus,
  updateProjectContractors,
  setFilters,
  clearFilters,
  clearError,
} = projectSlice.actions;

export default projectSlice.reducer;
