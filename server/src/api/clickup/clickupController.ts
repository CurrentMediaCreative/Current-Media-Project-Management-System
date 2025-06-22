import { Request, Response } from 'express';
import { clickupService } from '../../services/clickupService';
import { ClickUpData, ClickUpTask } from '../../types/clickup';

// Helper function to transform ClickUp task data into client-friendly format
const transformTaskData = (task: ClickUpTask) => {
  return {
    id: task.id,
    name: task.name,
    status: {
      label: task.status.status,
      color: task.status.color
    },
    dateCreated: task.date_created,
    dateUpdated: task.date_updated,
    url: task.url,
    customFields: Object.entries(task.customFields || {}).map(([id, value]) => ({
      id,
      name: id, // Using the key as name since it's a Record
      value
    }))
  };
};

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const getClickUpTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { parentTasks, taskRelationships } = await clickupService.getTasks();
    const transformedParentTasks = parentTasks.map(transformTaskData);
    const transformedRelationships = new Map();
    
    taskRelationships.forEach((tasks, parentId) => {
      transformedRelationships.set(parentId, tasks.map(transformTaskData));
    });

    res.json({
      parentTasks: transformedParentTasks,
      taskRelationships: transformedRelationships
    });
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
    res.json(transformTaskData(task));
  } catch (error) {
    console.error('Error getting ClickUp task:', error);
    res.status(500).json({ error: 'Failed to get ClickUp task' });
  }
};

export const createClickUpTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskData: Partial<ClickUpData> = req.body;
    const task = await clickupService.createTask(taskData);
    res.status(201).json(transformTaskData(task));
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
    res.json(transformTaskData(task));
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
