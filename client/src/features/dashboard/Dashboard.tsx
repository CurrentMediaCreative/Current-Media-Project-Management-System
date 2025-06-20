import React, { useEffect, useState } from 'react';
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
  Card,
  CardContent,
  CardActions,
  Badge,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Update as UpdateIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  OpenInNew as OpenInNewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { notificationService } from '../../services/notificationService';
import { DashboardData, NotificationItem } from './types';
import { ProjectPageData, ProjectStatus } from '../../types/project';
import { getClientName } from '../../utils/projectHelpers';
import ProjectDetailsDialog from '../projects/tracking/ProjectDetailsDialog';
import { projectService } from '../../services/projectService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectPageData | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [projectInSystem, setProjectInSystem] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleNotificationClear = async (id: string) => {
    try {
      await notificationService.clearNotification(id);
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          notifications: dashboardData.notifications.filter(n => n.id !== id)
        });
      }
    } catch (err) {
      console.error('Failed to clear notification:', err);
    }
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const handleProjectClick = async (project: ProjectPageData) => {
    setSelectedProject(project);
    setDetailsDialogOpen(true);
    if (project.clickUp?.id) {
      const exists = await projectService.checkProjectExists(project.clickUp.id);
      setProjectInSystem(exists);
    }
  };

  const renderProjectCard = (project: ProjectPageData) => {
    // Map ClickUp status to our system status
    const mapStatus = (status: string): ProjectStatus => {
      const lowerStatus = status.toLowerCase();
      if (['to do', 'media needed', 'in progress', 'revision'].includes(lowerStatus)) {
        return ProjectStatus.ACTIVE;
      }
      if (lowerStatus === 'done') {
        return ProjectStatus.COMPLETED;
      }
      return ProjectStatus.ACTIVE;
    };

    const projectId = project.local?.id || project.clickUp?.id;
    if (!projectId) return null;

    return (
      <Card 
        key={projectId}
        onClick={() => handleProjectClick(project)}
        sx={{ 
          mb: 2,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div">
              {getClientName(project)}
            </Typography>
            <IconButton 
              size="small"
              onClick={(e) => handleMenuOpen(e, project)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Typography color="textSecondary" gutterBottom>
            {project.local?.title || project.clickUp?.name || 'Untitled Project'}
          </Typography>
          {project.clickUp && (
            <Chip 
              label={project.clickUp.status}
              size="small"
              sx={{ 
                backgroundColor: project.clickUp.statusColor || '#666',
                color: 'white',
                mt: 1
              }}
            />
          )}
        </CardContent>
        <CardActions>
          {project.clickUp?.url && (
            <Button
              size="small"
              startIcon={<OpenInNewIcon />}
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.clickUp!.url, '_blank');
              }}
            >
              View in ClickUp
            </Button>
          )}
          {project.local?.id && (
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/projects/edit/${project.local!.id}`);
              }}
            >
              Edit
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  const renderProjectSection = (title: string, projects: ProjectPageData[]) => (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2, height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <Typography color="textSecondary">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {projects.map(renderProjectCard)}
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <>
      <Box p={3}>
        <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Project Overview</Typography>
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
                        <IconButton edge="end" onClick={() => handleNotificationClear(notification.id)}>
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
                          <>
                            {new Date(notification.createdAt).toLocaleString()}
                            {notification.metadata && (
                              <Typography component="span" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.875rem' }}>
                                {Object.entries(notification.metadata).map(([key, value]) => (
                                  `${key}: ${value}`
                                )).join(' • ')}
                              </Typography>
                            )}
                          </>
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
    </>
  );
};

export default Dashboard;
