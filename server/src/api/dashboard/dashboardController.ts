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
  let clickUpConfigError = false;

  try {
    // Get local projects
    try {
      localProjects = await projectService.getProjects();
    } catch (projectError) {
      console.error('Error fetching local projects:', projectError);
      const errorMessage = projectError instanceof Error ? projectError.message : 'Failed to fetch local projects';
      errors.push(errorMessage);
    }

    // Get ClickUp tasks
    try {
      const taskData = await clickupService.getTasks();
      clickUpTasks = taskData.parentTasks; // Only use parent tasks for dashboard
    } catch (clickUpError) {
      console.error('Error fetching ClickUp tasks:', clickUpError);
      if (clickUpError instanceof Error && 
         (clickUpError.message.includes('API key is not configured') || 
          clickUpError.message.includes('workspace ID is not configured'))) {
        clickUpConfigError = true;
        errors.push('ClickUp integration is not properly configured');
      } else {
        errors.push('Failed to fetch ClickUp tasks');
      }
    }

    // Calculate project status counts
    const projectStatusCounts = {
      newNotSent: localProjects.filter(p => p.status === 'NEW_NOT_SENT').length,
      newSent: localProjects.filter(p => p.status === 'NEW_SENT').length,
      activeInClickUp: localProjects.filter(p => p.status === 'ACTIVE').length,
      completed: localProjects.filter(p => p.status === 'COMPLETED').length,
      archived: localProjects.filter(p => p.status === 'ARCHIVED').length
    };

    // Group projects by status
    const projects = {
      newProjects: localProjects.filter(p => ['NEW_NOT_SENT', 'NEW_SENT'].includes(p.status)),
      activeProjects: localProjects.filter(p => p.status === 'ACTIVE'),
      postProduction: localProjects.filter(p => p.status === 'COMPLETED'),
      archived: localProjects.filter(p => p.status === 'ARCHIVED')
    };

    // Return data even if some parts failed
    const dashboardData = {
      localProjects,
      clickUpTasks,
      projectStatusCounts,
      projects,
      summary: {
        totalProjects: localProjects.length,
        totalTasks: clickUpTasks.length,
        linkedTasks: localProjects.filter(p => p.clickUpId).length
      },
      errors: errors.length > 0 ? errors : undefined,
      clickUpConfigError
    };

    // If both fetches failed and it's not just a config issue, return 500
    if (errors.length === 2 && !clickUpConfigError) {
      res.status(500).json({ error: 'Failed to get any dashboard data', errors });
    } else if (errors.length > 0) {
      // Return 206 for partial data, even if ClickUp is not configured
      res.status(206).json(dashboardData);
    } else {
      res.json(dashboardData);
    }
  } catch (error) {
    console.error('Critical error in dashboard overview:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process dashboard data';
    res.status(500).json({ error: errorMessage, errors });
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
    const taskData = await clickupService.getTasks();
    const { parentTasks, taskRelationships } = taskData;

    // Count subtasks for each parent task
    const taskCounts = parentTasks.map(task => ({
      id: task.id,
      name: task.name,
      status: task.status.status,
      subtaskCount: (taskRelationships.get(task.id) || []).length
    }));

    const summary = {
      total: parentTasks.length,
      byStatus: parentTasks.reduce((acc: Record<string, number>, task: ClickUpTask) => {
        acc[task.status.status] = (acc[task.status.status] || 0) + 1;
        return acc;
      }, {}),
      recentlyUpdated: parentTasks
        .sort((a, b) => new Date(b.dueDate || '').getTime() - new Date(a.dueDate || '').getTime())
        .slice(0, 5),
      taskCounts
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
