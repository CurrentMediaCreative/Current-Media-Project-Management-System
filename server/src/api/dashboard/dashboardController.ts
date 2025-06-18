import { Request, Response } from 'express';
import { storage } from '../../services/storageService';
import { clickupService } from '../../services/clickupService';
import { MappedProject } from '@shared/types/clickup';

interface Project extends MappedProject {}

interface Notification {
  id: string;
  type: string;
  status: string;
  message: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get dashboard overview data
 */
export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    // Get projects from both local storage and ClickUp
    const [localProjects, clickupProjects] = await Promise.all([
      storage.read<Project[]>('projects.json'),
      clickupService.getAllTasks()
    ]);

    console.log('Local projects:', localProjects);
    console.log('ClickUp projects:', clickupProjects);

    // Merge projects, preferring ClickUp data when available
    const mergedProjects = localProjects.map(localProject => {
      const clickupProject = clickupProjects.find(cp => cp.id === localProject.id);
      return clickupProject || localProject;
    });

    // Add any ClickUp projects that don't exist locally
    clickupProjects.forEach(clickupProject => {
      if (!mergedProjects.find(p => p.id === clickupProject.id)) {
        mergedProjects.push(clickupProject);
      }
    });

    console.log('Merged projects:', mergedProjects);

    // Group projects by status
    const projectsByStatus = {
      newProjects: mergedProjects.filter(p => 
        p.status === 'NEW_NOT_SENT' || p.status === 'NEW_SENT'
      ),
      pendingJake: [], // Empty array since PENDING_CLICKUP is redundant
      activeProjects: mergedProjects.filter(p => 
        p.status === 'ACTIVE_IN_CLICKUP'
      ),
      postProduction: mergedProjects.filter(p => 
        p.status === 'COMPLETED'
      ),
      archived: mergedProjects.filter(p => 
        p.status === 'ARCHIVED'
      )
    };

    // Count projects by status
    const projectStatusCounts = {
      newNotSent: mergedProjects.filter(p => p.status === 'NEW_NOT_SENT').length,
      newSent: mergedProjects.filter(p => p.status === 'NEW_SENT').length,
      pendingClickUp: 0, // Always 0 since PENDING_CLICKUP is redundant
      activeInClickUp: mergedProjects.filter(p => p.status === 'ACTIVE_IN_CLICKUP').length,
      completed: mergedProjects.filter(p => p.status === 'COMPLETED').length,
      archived: mergedProjects.filter(p => p.status === 'ARCHIVED').length
    };

    console.log('Projects by status:', projectsByStatus);
    console.log('Project status counts:', projectStatusCounts);

    res.json({
      projectStatusCounts,
      projects: projectsByStatus
    });
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    res.status(500).json({ message: 'Error getting dashboard overview' });
  }
};

/**
 * Get recent notifications
 */
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await storage.read<Notification[]>('notifications.json');
    res.json(notifications.slice(-10)); // Return last 10 notifications
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ message: 'Error getting notifications' });
  }
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notifications = await storage.read<Notification[]>('notifications.json');
    
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, status: 'READ' } : n
    );

    await storage.write('notifications.json', updatedNotifications);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};
