import React from 'react';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { Project } from '../../../../shared/types';

interface ActionItemsProps {
  project: Project;
  onUpdateStatus: (newStatus: string) => void;
}

const ActionItems: React.FC<ActionItemsProps> = ({ project, onUpdateStatus }) => {
  const renderActionButtons = () => {
    switch (project.status) {
      case 'new':
        return (
          <Stack spacing={2} direction="row">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onUpdateStatus('pending')}
            >
              Move to ClickUp Entry
            </Button>
            <Button 
              variant="outlined"
              onClick={() => {/* TODO: Open sort/categorize dialog */}}
            >
              Sort & Categorize
            </Button>
          </Stack>
        );

      case 'pending':
        return (
          <Stack spacing={2} direction="row">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onUpdateStatus('active')}
            >
              Mark as Active
            </Button>
            <Button 
              variant="outlined"
              onClick={() => {/* TODO: Open ClickUp entry form */}}
            >
              Create ClickUp Entry
            </Button>
          </Stack>
        );

      case 'active':
        return (
          <Stack spacing={2} direction="row">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onUpdateStatus('completed')}
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

      case 'completed':
        return (
          <Stack spacing={2} direction="row">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onUpdateStatus('archived')}
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

      case 'archived':
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
      case 'new':
        return 'Sort and categorize the project before creating ClickUp entry';
      case 'pending':
        return 'Create ClickUp entry with project details and requirements';
      case 'active':
        return 'Track progress and update project status';
      case 'completed':
        return 'Process final invoices and prepare for archival';
      case 'archived':
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
