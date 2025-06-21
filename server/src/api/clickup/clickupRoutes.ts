import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  getClickUpTask,
  getClickUpTasks,
  createClickUpTask,
  updateClickUpTask,
  deleteClickUpTask
} from './clickupController';

const router = express.Router();

// Get all tasks
router.get('/tasks', authMiddleware, getClickUpTasks);

// Get a specific task
router.get('/tasks/:taskId', authMiddleware, getClickUpTask);

// Create a new task
router.post('/tasks', authMiddleware, createClickUpTask);

// Update a task
router.put('/tasks/:taskId', authMiddleware, updateClickUpTask);

// Delete a task
router.delete('/tasks/:taskId', authMiddleware, deleteClickUpTask);

export default router;
