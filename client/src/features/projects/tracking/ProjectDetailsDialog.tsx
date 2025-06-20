// Component to be renamed post-integration - see activeContext.md
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
import { ProjectPageData, ClickUpTask, CLICKUP_FIELD_NAMES } from '../../../types';
import ProjectDocuments from './ProjectDocuments';
import { clickupService } from '../../../services/clickupService';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

interface ProjectDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  project: ProjectPageData;
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
        if (!project.clickUp?.id) throw new Error('No ClickUp ID found');
        
        const [taskData, subTasksData] = await Promise.all([
          clickupService.getTask(project.clickUp.id),
          clickupService.getSubTasks(project.clickUp.id)
        ]);
        
        setTaskDetails(taskData);
        setSubTasks(subTasksData || []); // Ensure we set an empty array if null
      } catch (err) {
        setError('Failed to load project details');
        console.error('Project details error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTaskDetails();
  }, [open, project.clickUp?.id, project.local?.id]);

  const handleEditProject = () => {
    if (!project.local?.id) return;
    navigate(`/projects/${project.local.id}/edit`);
    onClose();
  };

  const handleImportProject = () => {
    if (!project.clickUp?.id) return;
    navigate(`/projects/${project.clickUp.id}/import`);
    onClose();
  };

  const handleCreateDocument = (type: 'overview' | 'budget') => {
    if (!project.clickUp?.id) return;
    navigate(`/projects/${project.clickUp.id}/documents/create/${type}`);
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
          <Typography variant="h6">{project.local?.title || taskDetails.name}</Typography>
          {project.clickUp && (
            <Chip
              label={project.clickUp.status || taskDetails.status?.status || 'No Status'}
              size="small"
              sx={{
                backgroundColor: project.clickUp.statusColor || taskDetails.status?.color || 'grey',
                color: 'white'
              }}
            />
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Client</Typography>
          <Typography>{project.local?.client || 'Unknown'}</Typography>
          
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Task Type</Typography>
          <Typography>{project.clickUp?.customFields[CLICKUP_FIELD_NAMES.TASK_TYPE] || 'Not Specified'}</Typography>
          
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
          <Typography>{project.clickUp?.customFields[CLICKUP_FIELD_NAMES.INVOICE_STATUS] || 'Not Set'}</Typography>
          
          {project.clickUp?.customFields[CLICKUP_FIELD_NAMES.INVOICE_NUMBER] && (
            <>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Invoice #</Typography>
              <Typography>{project.clickUp?.customFields[CLICKUP_FIELD_NAMES.INVOICE_NUMBER]}</Typography>
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
            <ProjectDocuments projectId={project.local?.id || project.clickUp?.id || ''} />
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button
          startIcon={<OpenInNewIcon />}
          onClick={() => project.clickUp?.url && window.open(project.clickUp.url, '_blank')}
          disabled={!project.clickUp?.url}
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
