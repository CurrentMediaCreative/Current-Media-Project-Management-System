import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectScope, Contractor } from '../../shared/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string[];
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
    updateProjectStatus: (state, action: PayloadAction<{ projectId: string; status: string }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.status = action.payload.status;
      }
      if (state.currentProject?.id === action.payload.projectId) {
        state.currentProject.status = action.payload.status;
      }
    },
    updateProjectScope: (state, action: PayloadAction<{ projectId: string; scope: ProjectScope }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.scope = action.payload.scope;
      }
      if (state.currentProject?.id === action.payload.projectId) {
        state.currentProject.scope = action.payload.scope;
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
      status?: string[];
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
  updateProjectScope,
  updateProjectContractors,
  setFilters,
  clearFilters,
  clearError,
} = projectSlice.actions;

export default projectSlice.reducer;
