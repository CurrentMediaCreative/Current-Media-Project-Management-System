import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress,
  Alert,
  Container,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProjectPageData } from '../../../types';
import { 
  selectFilteredProjects,
  selectCacheStatus
} from '../../../store/slices/projectSlice';
import ProjectCard from '../../dashboard/ProjectCard';
import ProjectDetailsDialog from './ProjectDetailsDialog';
import ProjectErrorBoundary from './components/ProjectErrorBoundary';
import { useProjectData } from './hooks/useProjectData';

const ProjectTracking: React.FC = () => {
  const navigate = useNavigate();
  
  // Redux selectors
  const filteredProjects = useSelector(selectFilteredProjects);
  const cacheStatus = useSelector(selectCacheStatus);

  // Local state
  const [selectedProject, setSelectedProject] = useState<ProjectPageData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Use our custom hook for data fetching and polling
  const { loading, errors, refetch, refetchClickUp } = useProjectData();

  // Convert filtered projects to array format for grid display
  const projects: ProjectPageData[] = [
    ...filteredProjects.matched.map(p => ({
      local: p.local,
      clickUp: p.clickUp
    })),
    ...filteredProjects.unmatched.local.map(p => ({
      local: p.local,
      clickUp: undefined
    })),
    ...filteredProjects.unmatched.clickUp.map(p => ({
      local: undefined,
      clickUp: p.clickUp
    }))
  ];

  const handleProjectClick = (project: ProjectPageData) => {
    if (project.local?.id) {
      navigate(`/projects/${project.local.id}`);
    } else if (project.clickUp?.id) {
      setSelectedProject(project);
      setIsDetailsOpen(true);
    }
  };

  const handleCreateProject = () => {
    navigate('/projects/new');
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
          <Alert severity="error">{errors.local || errors.clickUp}</Alert>
        </Box>
      </ProjectErrorBoundary>
    );
  }

  return (
    <ProjectErrorBoundary onRetry={refetch}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <Typography variant="h4">Projects</Typography>
            
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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
          >
            Create New Project
          </Button>
        </Box>

        <Grid container spacing={3}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={project.local?.id || project.clickUp?.id || index}>
              <ProjectCard
                project={project}
                onProjectClick={handleProjectClick}
                onMenuOpen={() => {}}
                onEditClick={(e, id) => {
                  e.stopPropagation();
                  navigate(`/projects/${id}/edit`);
                }}
                onClickUpOpen={() => {}}
                onClickUpView={(e, url) => {
                  e.stopPropagation();
                  window.open(url, '_blank');
                }}
              />
            </Grid>
          ))}
        </Grid>

        {selectedProject && (
          <ProjectDetailsDialog
            open={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            project={selectedProject}
            isInSystem={false}
          />
        )}
      </Container>
    </ProjectErrorBoundary>
  );
};

export default ProjectTracking;
