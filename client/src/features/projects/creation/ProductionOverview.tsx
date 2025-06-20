import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { ProjectScope, Contractor } from '../../../types/project';
import { emailService } from '../../../services/emailService';

interface ProductionOverviewProps {
  onComplete: () => void;
  projectData: {
    title: string;
    client: string;
    timeframe: {
      startDate: string;
      endDate: string;
    };
    budget: {
      estimated: number;
      actual: number;
    };
    scope?: ProjectScope;
    contractors: Contractor[];
  };
  errors?: Record<string, string>;
  loading?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

const ProductionOverview: React.FC<ProductionOverviewProps> = ({ 
  onComplete, 
  projectData,
  errors,
  loading,
  onBack
}) => {
  const [activeSection, setActiveSection] = useState('timeline');
  const [sendingToJake, setSendingToJake] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSendToJake = async () => {
    try {
      setSendingToJake(true);
      await emailService.sendProjectToJake(projectData);
      setSnackbar({
        open: true,
        message: 'Project successfully sent to Jake!',
        severity: 'success'
      });
      onComplete();
    } catch (error) {
      console.error('Error sending to Jake:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send project to Jake. Please try again.',
        severity: 'error'
      });
    } finally {
      setSendingToJake(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSectionChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveSection(newValue);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDuration = () => {
    const start = new Date(projectData.timeframe.startDate);
    const end = new Date(projectData.timeframe.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  const getDeliverableStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'success', icon: <CheckCircleIcon /> };
      case 'in_progress':
        return { color: 'warning', icon: <WarningIcon /> };
      default:
        return { color: 'default', icon: <ScheduleIcon /> };
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Production Overview</Typography>
      
      <Tabs
        value={activeSection}
        onChange={handleSectionChange}
        sx={{ mb: 3 }}
      >
        <Tab label="Timeline" value="timeline" />
        <Tab label="Team" value="team" />
        <Tab label="Requirements" value="requirements" />
      </Tabs>

      <Grid container spacing={3}>
        {/* Project Summary Card */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Project Overview</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {projectData.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Client: {projectData.client}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Chip
                      icon={<ScheduleIcon />}
                      label={`Duration: ${calculateDuration()}`}
                      variant="outlined"
                    />
                    <Chip
                      icon={<MoneyIcon />}
                      label={`Budget: $${projectData.budget.estimated.toLocaleString()}`}
                      variant="outlined"
                      color="primary"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Project Timeline
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1">
                      Start: {formatDate(projectData.timeframe.startDate)}
                    </Typography>
                    <Typography variant="body1">
                      End: {formatDate(projectData.timeframe.endDate)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline Section */}
        {activeSection === 'timeline' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Production Timeline</Typography>
                <Divider sx={{ mb: 2 }} />
                {projectData.scope?.deliverables ? (
              <Stack spacing={2}>
                {projectData.scope.deliverables.map((deliverable) => {
                  const status = getDeliverableStatus(deliverable.status);
                  return (
                    <Paper key={deliverable.id} sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Chip
                            icon={status.icon}
                            label={formatDate(deliverable.dueDate)}
                            color={status.color as any}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle2">{deliverable.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {deliverable.description}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
              </Stack>
            ) : (
              <Typography color="text.secondary">No deliverables defined</Typography>
            )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Team Section */}
        {activeSection === 'team' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Team Composition</Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {projectData.contractors.map((contractor) => (
                    <ListItem key={contractor.email}>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={contractor.name}
                        secondary={`${contractor.role} - $${contractor.baseRate}/hr`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Requirements Section */}
        {activeSection === 'requirements' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Technical Requirements</Typography>
                <Divider sx={{ mb: 2 }} />
                {projectData.scope?.technicalRequirements ? (
                  <List>
                    {projectData.scope.technicalRequirements.map((req) => (
                      <ListItem key={req.id}>
                        <ListItemIcon>
                          <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={req.category}
                          secondary={
                            <Box>
                              <Typography variant="body2">{req.description}</Typography>
                              <Chip
                                size="small"
                                label={req.priority.toUpperCase()}
                                color={req.priority === 'high' ? 'error' : req.priority === 'medium' ? 'warning' : 'success'}
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No technical requirements defined</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Error Display */}
        {errors && Object.keys(errors).length > 0 && (
          <Grid item xs={12}>
            <Alert severity="error">
              <Typography variant="subtitle2" gutterBottom>
                Please fix the following errors:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </Alert>
          </Grid>
        )}

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onBack}
              disabled={loading}
            >
              Back
            </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendToJake}
                disabled={loading || sendingToJake || (errors && Object.keys(errors).length > 0)}
                startIcon={sendingToJake ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              >
                {sendingToJake ? 'Sending to Jake...' : 'Send to Jake'}
              </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default ProductionOverview;
