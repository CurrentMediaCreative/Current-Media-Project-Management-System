import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  ProjectPageData, 
  ProjectStatus, 
  hasClickUpData, 
  hasLocalData 
} from '../../../types/project';
import { projectService } from '../../../services/projectService';
import StatusDetails from './StatusDetails';
import ActionItems from './ActionItems';
import Timeline from './Timeline';
import ProjectDetailsDialog from './ProjectDetailsDialog';

interface ProjectPageProps {
  projectId?: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        if (projectId) {
          const projectData = await projectService.getProject(projectId);
          setProject(projectData);
        } else {
          // For demo/development, load first project if no ID provided
          const projects = await projectService.getProjects();
          setProject(projects[0] || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const handleStatusUpdate = async (newStatus: ProjectStatus) => {
    if (!project?.local?.id) return;

    try {
      const updatedProject = await projectService.updateProject(project.local.id, {
        local: {
          ...project.local,
          status: newStatus
        }
      });
      setProject(updatedProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleCreateLocalProject = () => {
    if (!project?.clickUp?.id) return;
    navigate(`/projects/${project.clickUp.id}/import`);
    setIsCreateDialogOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box>
        <Typography>No project found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          {project.local?.title || project.clickUp?.name || 'Project Details'}
        </Typography>
        
        {/* Show Create Local Project button only for ClickUp-only projects */}
        {!hasLocalData(project) && hasClickUpData(project) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
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
      <ProjectDetailsDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        project={project}
        isInSystem={false}
      />
    </Box>
  );
};

export default ProjectPage;
