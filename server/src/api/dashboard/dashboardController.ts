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

interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export const getDashboardOverview = async (req: AuthRequest, res: Response) => {
  let localProjects: LocalProject[] = [];
  let clickUpTasks: ClickUpTask[] = [];
  let errors: string[] = [];

  try {
    // Get local projects
    try {
      localProjects = await projectService.getProjects();
    } catch (projectError) {
      console.error('Error fetching local projects:', projectError);
      errors.push('Failed to fetch local projects');
    }

    // Get ClickUp tasks
    try {
      clickUpTasks = await clickupService.getTasks();
    } catch (clickUpError) {
      console.error('Error fetching ClickUp tasks:', clickUpError);
      errors.push('Failed to fetch ClickUp tasks');
    }

    // Return data even if some parts failed
    const dashboardData = {
      localProjects,
      clickUpTasks,
      summary: {
        totalProjects: localProjects.length,
        totalTasks: clickUpTasks.length,
        linkedTasks: localProjects.filter(p => p.clickUpId).length
      },
      errors: errors.length > 0 ? errors : undefined
    };

    // If both fetches failed, return 500, otherwise return partial data with 206
    if (errors.length === 2) {
      res.status(500).json({ error: 'Failed to get any dashboard data', errors });
    } else if (errors.length > 0) {
      res.status(206).json(dashboardData);
    } else {
      res.json(dashboardData);
    }
  } catch (error) {
    console.error('Critical error in dashboard overview:', error);
    res.status(500).json({ error: 'Failed to process dashboard data', errors });
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

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    // Get user notifications from database
    // This is a placeholder - implement actual notification retrieval logic
    const notifications: Notification[] = [];
    
    res.json(notifications);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const notificationId = req.params.id;
    
    // Mark notification as read in database
    // This is a placeholder - implement actual notification update logic
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
