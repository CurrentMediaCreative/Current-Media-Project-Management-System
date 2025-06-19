import { Request, Response } from 'express';
import { clickupService } from '../../services/clickupService';

export const getTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }
    
    const task = await clickupService.getTask(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error: any) {
    console.error('Error fetching task:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Task not found in ClickUp' });
    }
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Unauthorized access to ClickUp' });
    }
    res.status(500).json({ 
      message: 'Failed to fetch task details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getSubTasks = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }

    const subTasks = await clickupService.getSubTasks(taskId);
    if (!subTasks) {
      return res.status(404).json({ message: 'No subtasks found' });
    }

    res.json(subTasks);
  } catch (error: any) {
    console.error('Error fetching subtasks:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Parent task not found in ClickUp' });
    }
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Unauthorized access to ClickUp' });
    }
    res.status(500).json({ 
      message: 'Failed to fetch subtasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Update data is required' });
    }

    const task = await clickupService.updateTask(taskId, req.body);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error: any) {
    console.error('Error updating task:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Task not found in ClickUp' });
    }
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Unauthorized access to ClickUp' });
    }
    if (error.response?.status === 400) {
      return res.status(400).json({ 
        message: 'Invalid update data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    res.status(500).json({ 
      message: 'Failed to update task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
