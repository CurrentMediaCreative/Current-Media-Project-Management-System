import React, { useState, ReactNode } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Divider,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Button,
  Tooltip
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Update as UpdateIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  OpenInNew as OpenInNewIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProjectPageData, ClickUpData } from '../../types/project';
import ProjectCard from './ProjectCard';
import ProjectDetailsDialog from '../projects/tracking/ProjectDetailsDialog';
import ClickUpDataDialog from './ClickUpDataDialog';
import { ClickUpTask, ClickUpCustomField } from '../../types/clickup';
import { NotificationItem } from './types';
import ProjectErrorBoundary from '../projects/tracking/components/ProjectErrorBoundary';
import { useDashboardData } from './hooks/useDashboardData';
import { useDispatch } from 'react-redux';
import { updateClickUpProject, addMatch } from '../../store/slices/projectSlice';
import { clickupService } from '../../services/clickupService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Local state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectPageData | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [projectInSystem, setProjectInSystem] = useState(false);
  const [clickUpDialogOpen, setClickUpDialogOpen] = useState(false);
  const [clickUpTask, setClickUpTask] = useState<ClickUpTask | undefined>();
  const [clickUpLoading, setClickUpLoading] = useState(false);
  const [clickUpError, setClickUpError] = useState<string | undefined>();

  // Use our custom hook for data
  const {
    dashboardData,
    loading,
    errors,
    cacheStatus,
    refetch,
    refetchClickUp,
    clearNotification
  } = useDashboardData();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, project: ProjectPageData) => {
    event.stopPropagation();
    setSelectedProject(project);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedProject(null);
    setDetailsDialogOpen(false);
  };

  const handleProjectAction = (action: string) => {
    if (!selectedProject?.clickUp) return;
    
    switch (action) {
      case 'view':
        window.open(selectedProject.clickUp.url, '_blank');
        break;
      case 'edit':
        if (selectedProject.local?.id) {
          navigate(`/projects/edit/${selectedProject.local.id}`);
        }
        break;
      case 'details':
        setDetailsDialogOpen(true);
        setMenuAnchorEl(null);
        break;
      default:
        console.log(`Action ${action} not implemented`);
    }
  };

  const dispatch = useDispatch();

  const handleProjectClick = (project: ProjectPageData) => {
    setSelectedProject(project);
    setDetailsDialogOpen(true);
    if (project.clickUp?.id && project.local?.id) {
      dispatch(addMatch({ localId: project.local.id, clickUpId: project.clickUp.id }));
    }
  };

  const handleClickUpOpen = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setClickUpDialogOpen(true);
    setClickUpLoading(true);
    setClickUpError(undefined);
    
    try {
      const task = await clickupService.getTaskDetails(taskId);
      if (task) {
        const clickUpData: ClickUpData = {
          id: task.id,
          name: task.name,
          status: typeof task.status === 'string' ? task.status : task.status?.status || 'No Status',
          statusColor: typeof task.status === 'object' ? task.status.color : '#666666',
          url: task.url || '',
          customFields: task.custom_fields?.reduce((acc: Record<string, string | number | null>, field: ClickUpCustomField) => {
            acc[field.name] = field.value;
            return acc;
          }, {}) || {}
        };
        dispatch(updateClickUpProject(clickUpData));
        setClickUpTask(task);
      }
    } catch (err) {
      console.error('Failed to load ClickUp task:', err);
      setClickUpError('Failed to load ClickUp task details');
    } finally {
      setClickUpLoading(false);
    }
  };

  const handleClickUpView = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  const handleSyncStatus = async () => {
    if (!selectedProject?.local?.id || !clickUpTask?.id) return;
    
    try {
      await refetch(); // This will trigger a full data refresh
      setClickUpDialogOpen(false);
    } catch (err) {
      console.error('Failed to sync status:', err);
      setClickUpError('Failed to sync status with ClickUp');
    }
  };

  const handleEditClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    navigate(`/projects/edit/${projectId}`);
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'CONTRACTOR_CONFIRMATION':
      case 'CONTRACTOR_DECLINE':
        return <PersonIcon />;
      case 'PROJECT_NEW':
      case 'PROJECT_UPDATE':
        return <AssignmentIcon />;
      case 'CLICKUP_SYNC':
      case 'CLICKUP_UPDATE':
        return <UpdateIcon />;
      default:
        return <UpdateIcon />;
    }
  };

  const renderProjectSection = (title: string, projects: ProjectPageData[]) => {
    const validProjects = projects.filter(project => {
      if (!project || (!project.local && !project.clickUp)) return false;
      return Boolean(project.local?.id || project.clickUp?.id);
    });

    return (
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{title}</Typography>
            <Typography color="textSecondary">
              {validProjects.length} project{validProjects.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {validProjects.map(project => (
              <ProjectCard
                key={project.local?.id || project.clickUp?.id}
                project={project}
                onMenuOpen={handleMenuOpen}
                onProjectClick={handleProjectClick}
                onEditClick={handleEditClick}
                onClickUpOpen={handleClickUpOpen}
                onClickUpView={handleClickUpView}
              />
            ))}
          </Box>
        </Paper>
      </Grid>
    );
  };

  if (loading.projects || loading.notifications) {
    return (
      <ProjectErrorBoundary onRetry={refetch}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </ProjectErrorBoundary>
    );
  }

  if (errors.projects || errors.notifications) {
    return (
      <ProjectErrorBoundary onRetry={refetch}>
        <Box m={2}>
          <Alert severity="error">{errors.projects || errors.notifications}</Alert>
        </Box>
      </ProjectErrorBoundary>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <ProjectErrorBoundary onRetry={refetch}>
      <Box p={3}>
        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h5">Project Overview</Typography>
                  
                  {/* Show cache status indicator */}
                  {cacheStatus.stale && (
                    <Tooltip title="ClickUp data is stale. Click to refresh.">
                      <IconButton 
                        color="warning" 
                        onClick={refetchClickUp}
                        sx={{ ml: 1 }}
                      >
                        <WarningIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {/* Manual refresh button */}
                  <Tooltip title="Refresh data">
                    <IconButton 
                      onClick={refetch}
                      sx={{ ml: 1 }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/projects/new')}
                >
                  New Project
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={2}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="primary">
                      {dashboardData.projectStatusCounts.newNotSent}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      New - Not Sent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="primary">
                      {dashboardData.projectStatusCounts.newSent}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      New - Sent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="primary">
                      {dashboardData.projectStatusCounts.activeInClickUp}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Active
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="primary">
                      {dashboardData.projectStatusCounts.completed}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Post Production
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="primary">
                      {dashboardData.projectStatusCounts.archived}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Archived
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Navigation */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                  onClick={() => navigate('/projects')}
                >
                  <Box display="flex" alignItems="center">
                    <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h6">Projects</Typography>
                      <Typography variant="body2" color="textSecondary">
                        View and manage all projects
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                  onClick={() => navigate('/settings')}
                >
                  <Box display="flex" alignItems="center">
                    <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h6">Settings</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Manage system settings
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Project Sections */}
          {dashboardData && (
            <>
              {renderProjectSection('New Projects', dashboardData.projects.newProjects)}
              {renderProjectSection('Active Projects', dashboardData.projects.activeProjects)}
              {renderProjectSection('Post Production', dashboardData.projects.postProduction)}
              {renderProjectSection('Archived', dashboardData.projects.archived)}
            </>
          )}

          {/* Project Menu */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleProjectAction('view')}>
              <ListItemIcon>
                <OpenInNewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View in ClickUp</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleProjectAction('edit')}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Project</ListItemText>
            </MenuItem>
          </Menu>

          {/* Notifications */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              <List>
                {dashboardData.notifications.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No new notifications" />
                  </ListItem>
                ) : (
                  dashboardData.notifications.map((notification) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" onClick={() => clearNotification(notification.id)}>
                            <ClearIcon />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <Badge color="error" variant="dot" invisible={notification.status !== 'UNREAD'}>
                            {getNotificationIcon(notification.type)}
                          </Badge>
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.message}
                          secondary={
                            <Box component="div">
                              <Typography variant="body2">
                                {new Date(notification.createdAt).toLocaleString()}
                              </Typography>
                              {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                                <Box sx={{ mt: 1, color: 'text.secondary' }}>
                                  {Object.entries(notification.metadata || {}).map(([key, value], index, arr) => {
                                    // Process the value into a string representation
                                    const getDisplayValue = (val: any): string => {
                                      if (val === null || val === undefined) {
                                        return 'null';
                                      }
                                      if (typeof val === 'object') {
                                        if ('local' in val || 'clickUp' in val) {
                                          const parts: string[] = [];
                                          const typedValue = val as { local?: any; clickUp?: any };
                                          if (typedValue.local) {
                                            parts.push(`local: ${String(typedValue.local)}`);
                                          }
                                          if (typedValue.clickUp) {
                                            parts.push(`clickUp: ${String(typedValue.clickUp)}`);
                                          }
                                          return parts.join(' • ') || 'No project data';
                                        }
                                        return JSON.stringify(val);
                                      }
                                      return String(val);
                                    };

                                    // Get the display value safely
                                    const displayValue = (() => {
                                      try {
                                        return getDisplayValue(value);
                                      } catch (error) {
                                        console.error('Error processing metadata value:', error);
                                        return '[Invalid Value]';
                                      }
                                    })();

                                    // Return the metadata entry element
                                    return (
                                      <Box key={key} sx={{ display: 'inline' }}>
                                        <Typography variant="body2" sx={{ display: 'inline' }}>
                                          {`${key}:${String.fromCharCode(160)}`}
                                        </Typography>
                                        <Typography variant="body2" sx={{ display: 'inline' }}>
                                          {displayValue}
                                        </Typography>
                                        {index < arr.length - 1 && (
                                          <Typography variant="body2" sx={{ mx: 1, display: 'inline' }}>
                                            •
                                          </Typography>
                                        )}
                                      </Box>
                                    );
                                  })}
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Project Details Dialog */}
      {selectedProject && (
        <ProjectDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          project={selectedProject}
          isInSystem={projectInSystem}
        />
      )}

      {/* ClickUp Data Dialog */}
      <ClickUpDataDialog
        open={clickUpDialogOpen}
        onClose={() => {
          setClickUpDialogOpen(false);
          setClickUpTask(undefined);
          setClickUpError(undefined);
        }}
        task={clickUpTask}
        loading={clickUpLoading}
        error={clickUpError}
        onSyncStatus={handleSyncStatus}
      />
    </ProjectErrorBoundary>
  );
};

export default Dashboard;
