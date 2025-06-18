import { Request, Response } from 'express';
import { clickupService } from '../../services/clickupService';

export const getTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await clickupService.getTask(taskId);
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Failed to fetch task details' });
  }
};

export const getSubTasks = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const subTasks = await clickupService.getSubTasks(taskId);
    res.json(subTasks);
  } catch (error) {
    console.error('Error fetching subtasks:', error);
    res.status(500).json({ message: 'Failed to fetch subtasks' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await clickupService.updateTask(taskId, req.body);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};
