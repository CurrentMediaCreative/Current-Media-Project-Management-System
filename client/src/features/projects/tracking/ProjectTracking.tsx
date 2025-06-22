import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProjectPageData } from '../../../types';
import { projectService } from '../../../services/projectService';
import { clickupService } from '../../../services/clickupService';
import ProjectCard from '../../dashboard/ProjectCard';
import ProjectDetailsDialog from './ProjectDetailsDialog';

const ProjectTracking: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectPageData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const [localProjects, clickUpTasks] = await Promise.all([
          projectService.getProjects(),
          clickupService.getTasks()
        ]);

        // Convert ClickUp tasks to ProjectPageData format
        const clickUpProjects = clickUpTasks.map(task => ({
          clickUp: {
            id: task.id,
            name: task.name,
            status: task.status?.status || 'No Status',
            statusColor: task.status?.color || '#666666',
            url: task.url || '',
            customFields: task.custom_fields?.reduce((acc: Record<string, string | number | null>, field) => {
              acc[field.name] = field.value;
              return acc;
            }, {}) || {}
          }
        }));

        // Merge local and ClickUp projects by name
        const mergedProjects = [...localProjects];
        clickUpProjects.forEach(clickUpProject => {
          const existingProject = mergedProjects.find(
            p => p.local?.title === clickUpProject.clickUp?.name
          );
          if (existingProject) {
            existingProject.clickUp = clickUpProject.clickUp;
          } else {
            mergedProjects.push(clickUpProject);
          }
        });

        setProjects(mergedProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleProjectClick = (project: ProjectPageData) => {
    if (project.local?.id) {
      navigate(`/projects/${project.local.id}`);
    } else if (project.clickUp?.id) {
      setSelectedProject(project);
      setIsDetailsOpen(true);
    }
  };

  const handleCreateProject = () => {
    navigate('/projects/new');
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
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
        >
          Create New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={project.local?.id || project.clickUp?.id || index}>
            <ProjectCard
              project={project}
              onProjectClick={handleProjectClick}
              onMenuOpen={() => {}}
              onEditClick={(e, id) => {
                e.stopPropagation();
                navigate(`/projects/${id}/edit`);
              }}
              onClickUpOpen={() => {}}
              onClickUpView={(e, url) => {
                e.stopPropagation();
                window.open(url, '_blank');
              }}
            />
          </Grid>
        ))}
      </Grid>

      {selectedProject && (
        <ProjectDetailsDialog
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          project={selectedProject}
          isInSystem={false}
        />
      )}
    </Container>
  );
};

export default ProjectTracking;
