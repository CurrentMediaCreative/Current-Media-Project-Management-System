import express from 'express';
import { getTask, getSubTasks, updateTask } from './clickupController';

const router = express.Router();

// Get task details
router.get('/tasks/:taskId', getTask);

// Get subtasks for a task
router.get('/tasks/:taskId/subtasks', getSubTasks);

// Update task
router.patch('/tasks/:taskId', updateTask);

// Handle 404s for unknown routes
router.use('*', (_req, res) => {
  res.status(404).json({ message: 'ClickUp endpoint not found' });
});

export default router;
