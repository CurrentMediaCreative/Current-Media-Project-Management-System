import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  CardActions,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  OpenInNew as OpenInNewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { ProjectPageData, ProjectStatus } from '../../types/project';
import { getClientName } from '../../utils/projectHelpers';

interface ProjectCardProps {
  project: ProjectPageData;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, project: ProjectPageData) => void;
  onProjectClick: (project: ProjectPageData) => void;
  onEditClick: (e: React.MouseEvent, projectId: string) => void;
  onClickUpOpen: (e: React.MouseEvent, taskId: string) => void;
  onClickUpView: (e: React.MouseEvent, url: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onMenuOpen,
  onProjectClick,
  onEditClick,
  onClickUpOpen,
  onClickUpView,
}) => {
  const getStatusColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (['to do', 'media needed'].includes(lowerStatus)) return '#ff9800';
    if (['in progress', 'revision'].includes(lowerStatus)) return '#2196f3';
    if (lowerStatus === 'done') return '#4caf50';
    return '#666';
  };

  const getLocalStatusChip = (status: ProjectStatus) => {
    const statusColors = {
      [ProjectStatus.NEW_NOT_SENT]: '#ff9800',
      [ProjectStatus.NEW_SENT]: '#2196f3',
      [ProjectStatus.PENDING_CLICKUP]: '#9c27b0',
      [ProjectStatus.ACTIVE]: '#4caf50',
      [ProjectStatus.COMPLETED]: '#795548',
      [ProjectStatus.ARCHIVED]: '#9e9e9e',
    };

    const statusLabels = {
      [ProjectStatus.NEW_NOT_SENT]: 'New',
      [ProjectStatus.NEW_SENT]: 'Sent',
      [ProjectStatus.PENDING_CLICKUP]: 'Pending',
      [ProjectStatus.ACTIVE]: 'Active',
      [ProjectStatus.COMPLETED]: 'Completed',
      [ProjectStatus.ARCHIVED]: 'Archived',
    };

    return (
      <Chip
        label={statusLabels[status]}
        size="small"
        sx={{
          backgroundColor: statusColors[status],
          color: 'white',
          fontWeight: 500,
        }}
      />
    );
  };

  return (
    <Card
      onClick={() => onProjectClick(project)}
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" component="div" fontWeight={500}>
              {getClientName(project)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {project.local?.title || project.clickUp?.name || 'Untitled Project'}
            </Typography>
            <Box display="flex" gap={1}>
              {project.local && getLocalStatusChip(project.local.status)}
              {project.clickUp && (
                <Chip
                  label={project.clickUp.status}
                  size="small"
                  sx={{
                    backgroundColor: project.clickUp.statusColor || getStatusColor(project.clickUp.status),
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuOpen(e, project);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </CardContent>
      <CardActions sx={{ pt: 0 }}>
        {project.clickUp?.url && (
          <Button
            size="small"
            startIcon={<OpenInNewIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onClickUpView(e, project.clickUp!.url);
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
              onEditClick(e, project.local!.id);
            }}
          >
            Edit
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
