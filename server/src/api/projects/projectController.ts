import { Request, Response } from 'express';
import Project, { IProject } from '../../models/Project';
import User from '../../models/User';
import { ProjectStatus } from '@shared/types';
import { sendProjectFormEmail } from '../../services/emailService';

/**
 * Create a new project
 * @route POST /api/projects
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, client, budget, scope, deliverables, timeframe } = req.body;

    // Create new project
    const project = new Project({
      name,
      client,
      budget,
      scope,
      deliverables,
      timeframe,
      status: ProjectStatus.PENDING,
      createdBy: req.user.userId,
    });

    // Save project to database
    const savedProject = await project.save();

    // Get user name for email
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send email notification to Jake
    const emailSent = await sendProjectFormEmail(savedProject, user.name);

    return res.status(201).json({
      success: true,
      data: savedProject,
      message: 'Project created successfully',
      emailSent,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

/**
 * Get all projects
 * @route GET /api/projects
 */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error getting projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting projects',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

/**
 * Get project by ID
 * @route GET /api/projects/:id
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error getting project:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting project',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

/**
 * Update project
 * @route PUT /api/projects/:id
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, client, budget, scope, deliverables, timeframe, status } = req.body;

    // Find project
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Update project fields
    if (name) project.name = name;
    if (client) project.client = client;
    if (budget !== undefined) project.budget = budget;
    if (scope) project.scope = scope;
    if (deliverables) project.deliverables = deliverables;
    if (timeframe) {
      if (timeframe.startDate) project.timeframe.startDate = timeframe.startDate;
      if (timeframe.endDate) project.timeframe.endDate = timeframe.endDate;
    }
    if (status && Object.values(ProjectStatus).includes(status as ProjectStatus)) {
      project.status = status as ProjectStatus;
    }

    // Save updated project
    const updatedProject = await project.save();

    return res.status(200).json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

/**
 * Delete project
 * @route DELETE /api/projects/:id
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find and delete project
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};
