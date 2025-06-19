import { Request, Response } from 'express';
import { storage } from '../../services/storageService';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  [key: string]: any;
}

/**
 * Get all projects
 */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await storage.read<Project[]>('projects.json');
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'Error getting projects' });
  }
};

/**
 * Get project by ID
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projects = await storage.read<Project[]>('projects.json');
    const project = projects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ message: 'Error getting project' });
  }
};

/**
 * Create new project
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const projects = await storage.read<Project[]>('projects.json');
    
    const newProject = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    await storage.write('projects.json', projects);

    // Create notification
    const notifications = await storage.read<any[]>('notifications.json');
    notifications.push({
      id: Date.now().toString(),
      type: 'project_created',
      read: false,
      timestamp: new Date().toISOString(),
      details: {
        projectId: newProject.id,
        projectTitle: newProject.title
      }
    });
    await storage.write('notifications.json', notifications);

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
};

/**
 * Update project
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projects = await storage.read<Project[]>('projects.json');
    
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, ...req.body, updatedAt: new Date().toISOString() } : project
    );

    const updatedProject = updatedProjects.find(p => p.id === id);
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await storage.write('projects.json', updatedProjects);

    // Create notification
    const notifications = await storage.read<any[]>('notifications.json');
    notifications.push({
      id: Date.now().toString(),
      type: 'project_updated',
      read: false,
      timestamp: new Date().toISOString(),
      details: {
        projectId: updatedProject.id,
        projectTitle: updatedProject.title
      }
    });
    await storage.write('notifications.json', notifications);

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

/**
 * Delete project
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projects = await storage.read<Project[]>('projects.json');
    
    const projectToDelete = projects.find(p => p.id === id);
    if (!projectToDelete) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProjects = projects.filter(project => project.id !== id);
    await storage.write('projects.json', updatedProjects);

    // Create notification
    const notifications = await storage.read<any[]>('notifications.json');
    notifications.push({
      id: Date.now().toString(),
      type: 'project_deleted',
      read: false,
      timestamp: new Date().toISOString(),
      details: {
        projectId: id,
        projectTitle: projectToDelete.title
      }
    });
    await storage.write('notifications.json', notifications);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

/**
 * Check if project exists by ClickUp ID
 */
export const checkProjectExists = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { clickUpId } = req.params;

  try {
    // Log request details
    console.info('Checking project existence:', {
      clickUpId,
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString()
    });

    const projects = await storage.read<Project[]>('projects.json');
    
    // Validate projects data
    if (!Array.isArray(projects)) {
      throw new Error('Invalid projects data structure');
    }

    const exists = projects.some(project => project.clickUpId === clickUpId);
    
    // Log success response
    const duration = Date.now() - startTime;
    console.info('Project check completed:', {
      clickUpId,
      exists,
      duration: `${duration}ms`
    });

    res.json({
      exists,
      checked: new Date().toISOString(),
      requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  } catch (error: any) {
    // Log detailed error information
    const duration = Date.now() - startTime;
    console.error('Project existence check failed:', {
      clickUpId,
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      userId: (req as any).user?.id
    });

    // Send appropriate error response
    if (error.message.includes('not found') || error.message.includes('Invalid data')) {
      return res.status(503).json({
        message: 'Service temporarily unavailable',
        code: 'STORAGE_ERROR',
        requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
    }

    res.status(500).json({
      message: 'Failed to check project existence',
      code: 'PROJECT_CHECK_ERROR',
      requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  }
};

/**
 * Save project progress
 */
export const saveProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const progressData = req.body;

    if (!progressData || Object.keys(progressData).length === 0) {
      return res.status(400).json({ message: 'Progress data is required' });
    }

    const projects = await storage.read<Project[]>('projects.json');
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update only progress-related fields
    const updatedProject = {
      ...projects[projectIndex],
      progress: {
        ...projects[projectIndex].progress,
        ...progressData
      },
      updatedAt: new Date().toISOString()
    };

    projects[projectIndex] = updatedProject;
    await storage.write('projects.json', projects);

    // Create notification
    const notifications = await storage.read<any[]>('notifications.json');
    notifications.push({
      id: Date.now().toString(),
      type: 'project_progress_updated',
      read: false,
      timestamp: new Date().toISOString(),
      details: {
        projectId: id,
        projectTitle: updatedProject.title,
        progressUpdate: progressData
      }
    });
    await storage.write('notifications.json', notifications);

    res.json(updatedProject);
  } catch (error) {
    console.error('Error saving project progress:', error);
    res.status(500).json({ message: 'Error saving project progress' });
  }
};
