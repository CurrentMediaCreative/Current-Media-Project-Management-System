import { Request, Response } from 'express';
import { clickupService } from '../../services/clickupService';
import { projectService } from '../../services/projectService';
import { ClickUpTask } from '../../types/clickup';
import { LocalProject } from '../../types/project';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    // Get local projects
    const localProjects = await projectService.getProjects();

    // Get ClickUp tasks
    const clickUpTasks = await clickupService.getTasks();

    // Combine data
    const dashboardData = {
      localProjects,
      clickUpTasks,
      summary: {
        totalProjects: localProjects.length,
        totalTasks: clickUpTasks.length,
        linkedTasks: localProjects.filter(p => p.clickUpId).length
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
};

export const getProjectSummary = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await projectService.getProjects();
    const summary = {
      total: projects.length,
      byStatus: projects.reduce((acc: Record<string, number>, project: LocalProject) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {}),
      recentlyUpdated: projects
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
    };
    res.json(summary);
  } catch (error) {
    console.error('Error getting project summary:', error);
    res.status(500).json({ error: 'Failed to get project summary' });
  }
};

export const getTaskSummary = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await clickupService.getTasks();
    const summary = {
      total: tasks.length,
      byStatus: tasks.reduce((acc: Record<string, number>, task: ClickUpTask) => {
        acc[task.status.status] = (acc[task.status.status] || 0) + 1;
        return acc;
      }, {}),
      recentlyUpdated: tasks
        .sort((a, b) => new Date(b.dueDate || '').getTime() - new Date(a.dueDate || '').getTime())
        .slice(0, 5)
    };
    res.json(summary);
  } catch (error) {
    console.error('Error getting task summary:', error);
    res.status(500).json({ error: 'Failed to get task summary' });
  }
};
