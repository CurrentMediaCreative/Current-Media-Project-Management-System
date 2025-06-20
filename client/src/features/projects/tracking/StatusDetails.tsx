import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { LocalProject, CombinedProject, ProjectStatus, isClickUpSynced } from '@shared/types';
import { getClientName, getTaskType, getInvoiceStatus, getInvoiceNumber, getDisplayStatus } from '@shared/utils/projectHelpers';

type ProjectType = LocalProject | CombinedProject;

interface StatusDetailsProps {
  project: ProjectType;
}

const StatusDetails: React.FC<StatusDetailsProps> = ({ project }) => {
  const renderStatusSpecificDetails = () => {
    switch (project.status) {
      case ProjectStatus.NEW_NOT_SENT:
        return (
          <>
            <Typography variant="subtitle1" color="primary">New Project - Not Sent</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1"><strong>Client:</strong> {getClientName(project)}</Typography>
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
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Project details ready to be sent to the team
              </Typography>
            </Box>
          </>
        );

      case ProjectStatus.NEW_SENT:
        return (
          <>
            <Typography variant="subtitle1" color="primary">New Project - Sent to Team</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1"><strong>Client:</strong> {getClientName(project)}</Typography>
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
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Awaiting team confirmation before ClickUp setup
              </Typography>
            </Box>
          </>
        );

      case ProjectStatus.ACTIVE:
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
                {isClickUpSynced(project) && (
                  <>
                    <Typography variant="body1">
                      <strong>ClickUp Status:</strong> {getDisplayStatus(project)}
                    </Typography>
                  </>
                )}
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
                {isClickUpSynced(project) && (
                  <Box mt={1}>
                    <Typography variant="body2">
                      <strong>ClickUp Link:</strong>{' '}
                      <a href={project.clickUp.url} target="_blank" rel="noopener noreferrer">
                        View in ClickUp
                      </a>
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </>
        );

      case ProjectStatus.COMPLETED:
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

      case ProjectStatus.ARCHIVED:
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
