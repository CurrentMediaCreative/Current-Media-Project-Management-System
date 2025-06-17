import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Project } from '../../../../shared/types';

type ProjectStatus = 'new' | 'pending' | 'active' | 'completed' | 'archived';

interface StatusDetailsProps {
  project: Project;
}

const StatusDetails: React.FC<StatusDetailsProps> = ({ project }) => {
  const renderStatusSpecificDetails = () => {
    switch (project.status) {
      case 'new':
        return (
          <>
            <Typography variant="subtitle1" color="primary">Initial Project Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1"><strong>Client:</strong> {project.client}</Typography>
                <Typography variant="body1"><strong>Title:</strong> {project.title}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Start Date:</strong> {new Date(project.timeframe.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Estimated Budget:</strong> ${project.budget.estimated}
                </Typography>
              </Grid>
            </Grid>
          </>
        );

      case 'pending':
        return (
          <>
            <Typography variant="subtitle1" color="primary">ClickUp Entry Requirements</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Required Information:</strong></Typography>
                <ul>
                  <li>Project scope and deliverables</li>
                  <li>Timeline and milestones</li>
                  <li>Budget breakdown</li>
                  <li>Team assignments</li>
                </ul>
              </Grid>
            </Grid>
          </>
        );

      case 'active':
        return (
          <>
            <Typography variant="subtitle1" color="primary">Current Progress</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Start Date:</strong> {new Date(project.timeframe.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  <strong>End Date:</strong> {new Date(project.timeframe.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Budget Status:</strong>
                </Typography>
                <Typography variant="body2">
                  Estimated: ${project.budget.estimated}
                </Typography>
                <Typography variant="body2">
                  Actual: ${project.budget.actual}
                </Typography>
              </Grid>
            </Grid>
          </>
        );

      case 'completed':
        return (
          <>
            <Typography variant="subtitle1" color="primary">Invoice Status</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Final Budget:</strong> ${project.budget.actual}
                </Typography>
                <Typography variant="body1">
                  <strong>Completion Date:</strong> {new Date(project.timeframe.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </>
        );

      case 'archived':
        return (
          <>
            <Typography variant="subtitle1" color="primary">Project Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1"><strong>Final Budget:</strong> ${project.budget.actual}</Typography>
                <Typography variant="body1">
                  <strong>Completion Date:</strong> {new Date(project.timeframe.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Budget Variance:</strong> ${project.budget.actual - project.budget.estimated}
                </Typography>
                <Typography variant="body1">
                  <strong>Duration:</strong> {
                    Math.ceil((new Date(project.timeframe.endDate).getTime() - 
                             new Date(project.timeframe.startDate).getTime()) / 
                             (1000 * 60 * 60 * 24))} days
                </Typography>
              </Grid>
            </Grid>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box>
        {renderStatusSpecificDetails()}
      </Box>
    </Paper>
  );
};

export default StatusDetails;
