import { Request, Response } from 'express';
import { projectService } from '../../services/projectService';
import { CreateProjectInput, UpdateProjectInput } from '../../types/project';
import { clickupService } from '../../services/clickupService';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const checkProjectExists = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.params;
    const exists = await projectService.checkProjectExists(name);
    res.json({ exists });
  } catch (error) {
    console.error('Error checking project existence:', error);
    res.status(500).json({ error: 'Failed to check project existence' });
  }
};

export const pollClickUpData = async (req: AuthRequest, res: Response) => {
  try {
    const updates = await clickupService.pollForUpdates();
    res.json(updates);
  } catch (error) {
    console.error('Error polling ClickUp data:', error);
    res.status(500).json({ error: 'Failed to poll ClickUp data' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectData: CreateProjectInput = req.body;
    const project = await projectService.createProject(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const projects = await projectService.getProjects(
      status ? { status: status as string } : undefined
    );
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const projectData: UpdateProjectInput = req.body;
    const project = await projectService.updateProject(id, projectData);
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await projectService.deleteProject(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const linkClickUpTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id, taskName } = req.params;
    const project = await projectService.linkClickUpTask(id, taskName);
    res.json(project);
  } catch (error) {
    console.error('Error linking ClickUp task:', error);
    res.status(500).json({ error: 'Failed to link ClickUp task' });
  }
};

export const unlinkClickUpTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectService.unlinkClickUpTask(id);
    res.json(project);
  } catch (error) {
    console.error('Error unlinking ClickUp task:', error);
    res.status(500).json({ error: 'Failed to unlink ClickUp task' });
  }
};
