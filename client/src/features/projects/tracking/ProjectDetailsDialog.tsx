import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { MappedProject, ClickUpTask } from '@shared/types/clickup';
import { clickupService } from '@/services/clickupService';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

interface ProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  project: MappedProject;
  isInSystem?: boolean;
}

export const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({
  open,
  onClose,
  project,
  isInSystem = false
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskDetails, setTaskDetails] = useState<ClickUpTask | null>(null);
  const [subTasks, setSubTasks] = useState<ClickUpTask[]>([]);

  useEffect(() => {
    const loadTaskDetails = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load task details and subtasks
        const [taskData, subTasksData] = await Promise.all([
          clickupService.getTask(project.id),
          clickupService.getSubTasks(project.id)
        ]);
        
        setTaskDetails(taskData);
        setSubTasks(subTasksData);
      } catch (err) {
        setError('Failed to load project details');
        console.error('Project details error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTaskDetails();
  }, [open, project.id]);

  const handleEditProject = () => {
    navigate(`/projects/edit/${project.id}`);
    onClose();
  };

  const handleImportProject = () => {
    navigate(`/projects/import/${project.id}`);
    onClose();
  };

  const handleCreateDocument = (type: 'overview' | 'budget') => {
    navigate(`/projects/create-document/${project.id}/${type}`);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !taskDetails) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">
            {error || 'Failed to load project details'}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{taskDetails.name}</Typography>
          <Chip
            label={taskDetails.status?.status || 'No Status'}
            size="small"
            sx={{
              backgroundColor: taskDetails.status?.color || 'grey',
              color: 'white'
            }}
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Client</Typography>
          <Typography>{project.client || 'No Client'}</Typography>
          
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Task Type</Typography>
          <Typography>{project.taskType || 'Not Specified'}</Typography>
          
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Created</Typography>
          <Typography>
            {taskDetails.date_created 
              ? format(new Date(taskDetails.date_created), 'PPP')
              : 'Unknown'}
          </Typography>
          
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Last Updated</Typography>
          <Typography>
            {taskDetails.date_updated
              ? format(new Date(taskDetails.date_updated), 'PPP')
              : 'Unknown'}
          </Typography>
          
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Invoice Status</Typography>
          <Typography>{project.invoiceStatus || 'Not Set'}</Typography>
          
          {project.invoiceNumber && (
            <>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Invoice #</Typography>
              <Typography>{project.invoiceNumber}</Typography>
            </>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Sub-Tasks</Typography>
        <List>
          {subTasks.length === 0 ? (
            <ListItem>
              <ListItemText primary="No sub-tasks found" />
            </ListItem>
          ) : (
            subTasks.map((task) => (
              <ListItem key={task.id}>
                <ListItemText 
                  primary={task.name}
                  secondary={
                    <Chip
                      label={task.status?.status || 'No Status'}
                      size="small"
                      sx={{
                        backgroundColor: task.status?.color || 'grey',
                        color: 'white',
                        mt: 0.5
                      }}
                    />
                  }
                />
              </ListItem>
            ))
          )}
        </List>

        {isInSystem && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Project Documents</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Project Overview" />
                <Button startIcon={<EditIcon />} onClick={() => handleCreateDocument('overview')}>
                  Edit
                </Button>
              </ListItem>
              <ListItem>
                <ListItemText primary="Budget Document" />
                <Button startIcon={<EditIcon />} onClick={() => handleCreateDocument('budget')}>
                  Edit
                </Button>
              </ListItem>
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button
          startIcon={<OpenInNewIcon />}
          onClick={() => window.open(project.clickUpUrl, '_blank')}
        >
          View in ClickUp
        </Button>
        
        {isInSystem ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditProject}
          >
            Edit Project
          </Button>
        ) : (
          <Box>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleCreateDocument('overview')}
              sx={{ mr: 1 }}
            >
              Create Overview
            </Button>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleCreateDocument('budget')}
              sx={{ mr: 1 }}
            >
              Create Budget
            </Button>
            <Button
              variant="contained"
              onClick={handleImportProject}
            >
              Import Project
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
