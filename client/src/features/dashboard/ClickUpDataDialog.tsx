import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ClickUpTask, ClickUpCustomField, CLICKUP_FIELD_NAMES } from '../../types/clickup';

interface ClickUpDataDialogProps {
  open: boolean;
  onClose: () => void;
  task?: ClickUpTask;
  loading?: boolean;
  error?: string;
  onSyncStatus?: () => void;
}

const ClickUpDataDialog: React.FC<ClickUpDataDialogProps> = ({
  open,
  onClose,
  task,
  loading = false,
  error,
  onSyncStatus,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderCustomField = (field: ClickUpCustomField) => {
    const value = field.value ?? 'N/A';
    return (
      <Box key={field.id} sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {field.name}
        </Typography>
        <Typography variant="body1">
          {typeof value === 'number' ? value.toLocaleString() : value.toString()}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          ClickUp Task Details
        </Typography>
        {task?.status && (
          <Chip
            label={task.status.status}
            size="small"
            sx={{
              backgroundColor: task.status.color || '#666',
              color: 'white',
              mt: 1,
            }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {task ? (
          <>
            <Typography variant="h6" gutterBottom>
              {task.name}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Task ID
              </Typography>
              <Typography variant="body1">{task.id}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Dates
              </Typography>
              <Typography variant="body2">
                Created: {formatDate(task.date_created)}
              </Typography>
              <Typography variant="body2">
                Last Updated: {formatDate(task.date_updated)}
              </Typography>
            </Box>

            {task.custom_fields && task.custom_fields.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Custom Fields
                </Typography>
                {task.custom_fields.map(renderCustomField)}
              </Box>
            )}

            {task.url && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  ClickUp URL
                </Typography>
                <Typography variant="body1">
                  <a href={task.url} target="_blank" rel="noopener noreferrer">
                    Open in ClickUp
                  </a>
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Typography color="text.secondary">No ClickUp data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {task && onSyncStatus && (
          <Button onClick={onSyncStatus} color="primary">
            Sync Status
          </Button>
        )}
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClickUpDataDialog;
