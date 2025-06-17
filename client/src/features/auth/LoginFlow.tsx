import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import LoginForm from './LoginForm';
import { User } from '../../../shared/types';
import { useNavigate } from 'react-router-dom';

interface Notification {
  type: 'contractor' | 'invoice' | 'project' | 'clickup';
  count: number;
  items: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
}

interface LoginFlowProps {
  onLogin?: (user: User) => void;
  onNotificationClick?: (type: Notification['type'], id: string) => void;
  redirectTo?: string;
}

const LoginFlow: React.FC<LoginFlowProps> = ({ onLogin, onNotificationClick, redirectTo = '/dashboard' }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<{
    [key in Notification['type']]: Notification;
  }>({
    contractor: { type: 'contractor', count: 0, items: [] },
    invoice: { type: 'invoice', count: 0, items: [] },
    project: { type: 'project', count: 0, items: [] },
    clickup: { type: 'clickup', count: 0, items: [] }
  });

  const handleLogin = async (user: User) => {
    setIsLoading(true);
    try {
      // Fetch notifications
      // TODO: Implement actual notification fetching
      const mockNotifications: { [key in Notification['type']]: Notification } = {
        contractor: {
          type: 'contractor',
          count: 2,
          items: [
            {
              id: '1',
              title: 'New Contractor Application',
              description: 'John Doe has applied for the Video Editor position',
              timestamp: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Rate Update Request',
              description: 'Jane Smith has requested a rate update',
              timestamp: new Date().toISOString()
            }
          ]
        },
        invoice: {
          type: 'invoice' as const,
          count: 1,
          items: [
            {
              id: '1',
              title: 'Outstanding Invoice',
              description: 'Project XYZ invoice is due in 3 days',
              timestamp: new Date().toISOString()
            }
          ]
        },
        project: { type: 'project', count: 0, items: [] },
        clickup: { type: 'clickup', count: 0, items: [] }
      };

      setNotifications(mockNotifications);
      
      if (onLogin) {
        onLogin(user);
      } else {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderNotificationSection = (notification: Notification) => {
    const titles = {
      contractor: 'Pending Contractor Confirmations',
      invoice: 'Outstanding Invoices',
      project: 'New Projects',
      clickup: 'ClickUp Updates'
    };

    return (
      <Grid item xs={12} md={6}>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="h6">{titles[notification.type]}</Typography>
          {notification.count > 0 ? (
            <Box>
              {notification.items.map(item => (
                <Box 
                  key={item.id}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    p: 1
                  }}
                  onClick={() => onNotificationClick?.(notification.type, item.id)}
                >
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.timestamp}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">No pending items</Typography>
          )}
        </Box>
      </Grid>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <LoginForm onSubmit={handleLogin} />
      </Paper>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Notifications</Typography>
          <Grid container spacing={2}>
            {renderNotificationSection(notifications.contractor)}
            {renderNotificationSection(notifications.invoice)}
            {renderNotificationSection(notifications.project)}
            {renderNotificationSection(notifications.clickup)}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default LoginFlow;
