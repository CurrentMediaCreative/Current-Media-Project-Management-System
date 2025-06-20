import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalProject, ProjectScope, Contractor, ProjectStatus, ProjectPageData } from '../../types/project';

type ProjectType = LocalProject | ProjectPageData;

interface ProjectState {
  projects: ProjectType[];
  currentProject: ProjectType | null;
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
    fetchProjectsSuccess: (state, action: PayloadAction<ProjectType[]>) => {
      state.loading = false;
      state.projects = action.payload;
    },
    fetchProjectsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<ProjectType>) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    updateProjectStatus: (state, action: PayloadAction<{ projectId: string; status: ProjectStatus }>) => {
      const project = state.projects.find((p: ProjectType) => {
        if ('status' in p) return p.id === action.payload.projectId;
        return p.local?.id === action.payload.projectId;
      });
      
      if (project) {
        if ('status' in project) {
          project.status = action.payload.status;
        } else if (project.local) {
          project.local.status = action.payload.status;
        }
      }

      if (state.currentProject) {
        if ('status' in state.currentProject) {
          if (state.currentProject.id === action.payload.projectId) {
            state.currentProject.status = action.payload.status;
          }
        } else if (state.currentProject.local?.id === action.payload.projectId) {
          state.currentProject.local.status = action.payload.status;
        }
      }
    },
    updateProjectContractors: (state, action: PayloadAction<{ projectId: string; contractors: Contractor[] }>) => {
      const project = state.projects.find((p: ProjectType) => {
        if ('contractors' in p) return p.id === action.payload.projectId;
        return p.local?.id === action.payload.projectId;
      });
      
      if (project) {
        if ('contractors' in project) {
          project.contractors = action.payload.contractors;
        } else if (project.local) {
          project.local.contractors = action.payload.contractors;
        }
      }

      if (state.currentProject) {
        if ('contractors' in state.currentProject) {
          if (state.currentProject.id === action.payload.projectId) {
            state.currentProject.contractors = action.payload.contractors;
          }
        } else if (state.currentProject.local?.id === action.payload.projectId) {
          state.currentProject.local.contractors = action.payload.contractors;
        }
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
