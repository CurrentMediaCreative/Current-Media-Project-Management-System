import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import { Project } from '../../../shared/types';
import { projectService } from '../services/projectService';
import StatusDetails from './components/StatusDetails';
import ActionItems from './components/ActionItems';
import Timeline from './components/Timeline';

interface ProjectTrackingProps {
  projectId?: string;
}

const ProjectTracking: React.FC<ProjectTrackingProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { label: 'New - Not Sort', value: 'new' },
    { label: 'Pending ClickUp Entry', value: 'pending' },
    { label: 'Active in ClickUp', value: 'active' },
    { label: 'Completed - Pending Invoices', value: 'completed' },
    { label: 'Archived', value: 'archived' }
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

  const handleStatusUpdate = async (newStatus: string) => {
    if (!project) return;

    try {
      const updatedProject = await projectService.updateProjectStatus(project.id, newStatus);
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

  const activeStep = steps.findIndex(step => step.value === project.status);

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
