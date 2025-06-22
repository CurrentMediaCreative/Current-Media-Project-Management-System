import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ProjectPageData, 
  ProjectStatus, 
  LocalProject,
  hasClickUpData, 
  hasLocalData
} from '../../../types/project';
import {
  setCurrentProject,
  updateLocalProject,
  selectAllProjects,
  selectFilteredProjects,
  selectCacheStatus,
  fetchLocalProjectsFailure
} from '../../../store/slices/projectSlice';
import { projectService } from '../../../services/projectService';
import StatusDetails from './StatusDetails';
import ActionItems from './ActionItems';
import Timeline from './Timeline';
import ProjectDetailsDialog from './ProjectDetailsDialog';
import ProjectErrorBoundary from './components/ProjectErrorBoundary';
import { useProjectData } from './hooks/useProjectData';

interface ProjectPageProps {
  projectName?: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ projectName }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux selectors
  const allProjects = useSelector(selectAllProjects);
  const filteredProjects = useSelector(selectFilteredProjects);
  const cacheStatus = useSelector(selectCacheStatus);

  // Local state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Use our custom hook for data fetching and polling
  const { loading, errors, refetch, refetchClickUp } = useProjectData();

  // Set current project based on URL if provided
  React.useEffect(() => {
    if (projectName) {
      const matchedProject = allProjects.matched.find(
        p => p.local?.title === projectName || p.clickUp?.name === projectName
      );
      const unmatchedLocal = allProjects.unmatched.local.find(
        p => p.local?.title === projectName
      );
      const unmatchedClickUp = allProjects.unmatched.clickUp.find(
        p => p.clickUp?.name === projectName
      );

      if (matchedProject) {
        dispatch(setCurrentProject({ id: matchedProject.id, type: 'local' }));
      } else if (unmatchedLocal) {
        dispatch(setCurrentProject({ id: unmatchedLocal.id, type: 'local' }));
      } else if (unmatchedClickUp) {
        dispatch(setCurrentProject({ id: unmatchedClickUp.id, type: 'clickup' }));
      }
    }
  }, [dispatch, projectName, allProjects]);

  // Find the project in our filtered data
  const project: ProjectPageData | null = (() => {
    if (!projectName) return null;

    const matchedProject = filteredProjects.matched.find(
      p => p.local?.title === projectName || p.clickUp?.name === projectName
    );
    if (matchedProject) {
      return {
        local: matchedProject.local,
        clickUp: matchedProject.clickUp
      };
    }

    const unmatchedLocal = filteredProjects.unmatched.local.find(
      p => p.local?.title === projectName
    );
    if (unmatchedLocal) {
      return {
        local: unmatchedLocal.local,
        clickUp: undefined
      };
    }

    const unmatchedClickUp = filteredProjects.unmatched.clickUp.find(
      p => p.clickUp?.name === projectName
    );
    if (unmatchedClickUp) {
      return {
        local: undefined,
        clickUp: unmatchedClickUp.clickUp
      };
    }

    return null;
  })();

  const handleStatusUpdate = async (newStatus: ProjectStatus) => {
    if (!project?.local?.id) return;

    try {
      const updatedProjectData = await projectService.updateProject(project.local.id, {
        local: {
          ...project.local,
          status: newStatus
        }
      });
      const updatedProject = updatedProjectData?.local as LocalProject;
      if (updatedProject) {
        dispatch(updateLocalProject(updatedProject));
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(fetchLocalProjectsFailure(err.message));
      }
    }
  };

  const handleCreateLocalProject = () => {
    if (!project?.clickUp?.id) return;
    navigate(`/projects/${project.clickUp.id}/import`);
    setIsCreateDialogOpen(false);
  };

  if (loading.local || loading.clickUp) {
    return (
      <ProjectErrorBoundary onRetry={refetch}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </ProjectErrorBoundary>
    );
  }

  if (errors.local || errors.clickUp) {
    return (
      <ProjectErrorBoundary onRetry={refetch}>
        <Box>
          <Alert severity="error">
            {errors.local || errors.clickUp}
          </Alert>
        </Box>
      </ProjectErrorBoundary>
    );
  }

  if (!project) {
    return (
      <ProjectErrorBoundary onRetry={refetch}>
        <Box>
          <Typography>No project found</Typography>
        </Box>
      </ProjectErrorBoundary>
    );
  }

  return (
    <ProjectErrorBoundary onRetry={refetch}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <Typography variant="h4">
              {project.local?.title || project.clickUp?.name || 'Project Details'}
            </Typography>
            
            {/* Show cache status indicator */}
            {cacheStatus.stale && (
              <Tooltip title="ClickUp data is stale. Click to refresh.">
                <IconButton 
                  color="warning" 
                  onClick={refetchClickUp}
                  sx={{ ml: 1 }}
                >
                  <WarningIcon />
                </IconButton>
              </Tooltip>
            )}
            
            {/* Manual refresh button */}
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={refetch}
                sx={{ ml: 1 }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Show Create Local Project button only for ClickUp-only projects */}
          {!hasLocalData(project) && hasClickUpData(project) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateLocalProject}
            >
              Create Local Project
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Local Project Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Local Project Details
              </Typography>
              {hasLocalData(project) ? (
                <>
                  <StatusDetails project={project} />
                  <Box mt={2}>
                    <ActionItems project={project} onUpdateStatus={handleStatusUpdate} />
                  </Box>
                </>
              ) : (
                <Alert severity="info">
                  No local project data available. 
                  {hasClickUpData(project) && ' Click "Create Local Project" to add local tracking.'}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* ClickUp Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                ClickUp Details
              </Typography>
              {hasClickUpData(project) ? (
                <Box>
                  <Typography>
                    <strong>Status:</strong>{' '}
                    {project.clickUp && (
                      <Box
                        component="span"
                        sx={{
                          color: project.clickUp.statusColor,
                          fontWeight: 'bold'
                        }}
                      >
                        {project.clickUp.status}
                      </Box>
                    )}
                  </Typography>
                  <Typography>
                    <strong>Task URL:</strong>{' '}
                    {project.clickUp?.url && (
                      <a href={project.clickUp.url} target="_blank" rel="noopener noreferrer">
                        View in ClickUp
                      </a>
                    )}
                  </Typography>
                  {project.clickUp?.customFields && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Custom Fields
                      </Typography>
                      {Object.entries(project.clickUp.customFields).map(([key, value]) => (
                        <Typography key={key}>
                          <strong>{key}:</strong> {value || 'N/A'}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Alert severity="info">
                  No ClickUp data available. This project will be linked to ClickUp when sent to Jake.
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Timeline Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Project Timeline
              </Typography>
              <Timeline project={project} />
            </Paper>
          </Grid>
        </Grid>

        {/* Create Local Project Dialog */}
        {project && (
          <ProjectDetailsDialog
            open={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            project={project}
            isInSystem={false}
          />
        )}
      </Box>
    </ProjectErrorBoundary>
  );
};

export default ProjectPage;
