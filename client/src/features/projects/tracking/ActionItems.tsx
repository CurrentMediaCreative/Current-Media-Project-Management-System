import React from 'react';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { LocalProject, CombinedProject, ProjectStatus } from '@shared/types';

type ProjectType = LocalProject | CombinedProject;

interface ActionItemsProps {
  project: ProjectType;
  onUpdateStatus: (newStatus: ProjectStatus) => void;
}

const ActionItems: React.FC<ActionItemsProps> = ({ project, onUpdateStatus }) => {
  const renderActionButtons = () => {
    switch (project.status) {
      case ProjectStatus.NEW_NOT_SENT:
        return (
          <Stack spacing={2} direction="row">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onUpdateStatus(ProjectStatus.NEW_SENT)}
            >
              Send to Team
            </Button>
            <Button 
              variant="outlined"
              onClick={() => {/* TODO: Open sort/categorize dialog */}}
            >
              Sort & Categorize
            </Button>
          </Stack>
        );

      case ProjectStatus.NEW_SENT:
        return (
          <Stack spacing={2} direction="row">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onUpdateStatus(ProjectStatus.ACTIVE)}
            >
              Mark as Active
            </Button>
            <Button 
              variant="outlined"
              onClick={() => {/* TODO: Open team confirmation dialog */}}
            >
              Check Team Status
            </Button>
          </Stack>
        );

      case ProjectStatus.ACTIVE:
        return (
          <Stack spacing={2} direction="row">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onUpdateStatus(ProjectStatus.COMPLETED)}
            >
              Mark as Completed
            </Button>
            <Button 
              variant="outlined"
              onClick={() => {/* TODO: Open progress update form */}}
            >
              Update Progress
            </Button>
          </Stack>
        );

      case ProjectStatus.COMPLETED:
        return (
          <Stack spacing={2} direction="row">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onUpdateStatus(ProjectStatus.ARCHIVED)}
            >
              Archive Project
            </Button>
            <Button 
              variant="outlined"
              onClick={() => {/* TODO: Open invoice processing */}}
            >
              Process Invoices
            </Button>
          </Stack>
        );

      case ProjectStatus.ARCHIVED:
        return (
          <Stack spacing={2} direction="row">
            <Button 
              variant="outlined"
              onClick={() => {/* TODO: Generate project report */}}
            >
              Generate Report
            </Button>
          </Stack>
        );

      default:
        return null;
    }
  };

  const renderActionDescription = () => {
    switch (project.status) {
      case ProjectStatus.NEW_NOT_SENT:
        return 'Review project details and send to team for initial review';
      case ProjectStatus.NEW_SENT:
        return 'Waiting for team confirmation and ClickUp setup';
      case ProjectStatus.ACTIVE:
        return 'Track progress and update project status';
      case ProjectStatus.COMPLETED:
        return 'Process final invoices and prepare for archival';
      case ProjectStatus.ARCHIVED:
        return 'Generate project reports and analytics';
      default:
        return '';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Available Actions
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {renderActionDescription()}
        </Typography>
        {renderActionButtons()}
      </Box>
    </Paper>
  );
};

export default ActionItems;
