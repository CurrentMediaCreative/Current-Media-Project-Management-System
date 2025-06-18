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
