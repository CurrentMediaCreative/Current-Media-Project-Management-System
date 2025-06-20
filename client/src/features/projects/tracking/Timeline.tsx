import React from 'react';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';
import { LocalProject, CombinedProject } from '@shared/types';
import { getDisplayStatus } from '@shared/utils/projectHelpers';

type ProjectType = LocalProject | CombinedProject;

interface TimelineProps {
  project: ProjectType;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'status' | 'milestone' | 'deadline';
}

const Timeline: React.FC<TimelineProps> = ({ project }) => {
  // In a real implementation, these would come from the backend
  const mockEvents: TimelineEvent[] = [
    {
      date: project.timeframe.startDate,
      title: 'Project Created',
      description: 'Initial project details submitted',
      type: 'status'
    },
    {
      date: project.timeframe.startDate,
      title: 'Pre-Production Start',
      description: 'Begin pre-production phase',
      type: 'milestone'
    },
    {
      date: project.timeframe.endDate,
      title: 'Delivery Deadline',
      description: 'Final deliverables due',
      type: 'deadline'
    }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'status':
        return 'primary.main';
      case 'milestone':
        return 'success.main';
      case 'deadline':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTimeInStage = () => {
    const now = new Date();
    const start = new Date(project.timeframe.startDate);
    const days = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" color="primary" gutterBottom>
        Project Timeline
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          <strong>Current Stage:</strong> {getDisplayStatus(project)}
        </Typography>
        <Typography variant="body2">
          <strong>Time in Stage:</strong> {calculateTimeInStage()}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {mockEvents.map((event, index) => (
          <Box key={index}>
            <Typography 
              variant="body2" 
              color={getEventColor(event.type)}
              sx={{ fontWeight: 'bold' }}
            >
              {formatDate(event.date)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
            {index < mockEvents.length - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Project Duration: {Math.ceil(
            (new Date(project.timeframe.endDate).getTime() - 
             new Date(project.timeframe.startDate).getTime()) / 
             (1000 * 60 * 60 * 24)
          )} days
        </Typography>
      </Box>
    </Paper>
  );
};

export default Timeline;
