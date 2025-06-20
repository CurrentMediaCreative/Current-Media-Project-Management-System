import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import { ProjectPageData, ProjectStatus, LocalProject, hasClickUpData } from '../../../types';
import { projectService } from '../../../services/projectService';
import StatusDetails from './StatusDetails';
import ActionItems from './ActionItems';
import Timeline from './Timeline';

interface ProjectTrackingProps {
  projectId?: string;
}

const ProjectTracking: React.FC<ProjectTrackingProps> = ({ projectId }) => {
  const [project, setProject] = useState<ProjectPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { label: 'New - Not Sent', value: ProjectStatus.NEW_NOT_SENT },
    { label: 'New - Sent', value: ProjectStatus.NEW_SENT },
    { label: 'Active', value: ProjectStatus.ACTIVE },
    { label: 'Completed', value: ProjectStatus.COMPLETED },
    { label: 'Archived', value: ProjectStatus.ARCHIVED }
  ];

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        // For demo, load the first project if no ID provided
        const projects = await projectService.getProjects();
        const targetProject = projectId 
          ? await projectService.getProject(projectId)
          : projects[0];
        setProject(targetProject);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const handleStatusUpdate = async (newStatus: ProjectStatus) => {
    if (!project) return;

    try {
      if (!project.local) return;

      // If project is synced with ClickUp, we need to handle both local and ClickUp updates
      if (hasClickUpData(project)) {
        // TODO: Add ClickUp status update logic here
        console.log('Updating ClickUp status:', project.clickUp?.id, newStatus);
      }

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
        <Typography color="error">{error}</Typography>
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

  const activeStep = steps.findIndex(step => project.local ? step.value === project.local.status : 0);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Project Status Tracking</Typography>
      
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.value}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={8}>
          <StatusDetails project={project} />
          <ActionItems project={project} onUpdateStatus={handleStatusUpdate} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Timeline project={project} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectTracking;
