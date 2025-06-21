import { Request, Response } from 'express';
import { clickupService } from '../../services/clickupService';
import { ClickUpData } from '../../types/clickup';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const getClickUpTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await clickupService.getTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error getting ClickUp tasks:', error);
    res.status(500).json({ error: 'Failed to get ClickUp tasks' });
  }
};

export const getClickUpTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await clickupService.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error getting ClickUp task:', error);
    res.status(500).json({ error: 'Failed to get ClickUp task' });
  }
};

export const createClickUpTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskData: Partial<ClickUpData> = req.body;
    const task = await clickupService.createTask(taskData);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating ClickUp task:', error);
    res.status(500).json({ error: 'Failed to create ClickUp task' });
  }
};

export const updateClickUpTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const taskData: Partial<ClickUpData> = req.body;
    const task = await clickupService.updateTask(taskId, taskData);
    res.json(task);
  } catch (error) {
    console.error('Error updating ClickUp task:', error);
    res.status(500).json({ error: 'Failed to update ClickUp task' });
  }
};

export const deleteClickUpTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    await clickupService.deleteTask(taskId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ClickUp task:', error);
    res.status(500).json({ error: 'Failed to delete ClickUp task' });
  }
};
