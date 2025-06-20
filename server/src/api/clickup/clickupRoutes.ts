/**
 * ClickUp Routes
 * 
 * These routes provide read-only access to ClickUp data.
 * They are used to fetch and display project information from ClickUp,
 * but never modify any data in ClickUp. All modifications are
 * handled locally in our own system.
 */

import express from 'express';
import { getTask, getSubTasks } from './clickupController';

const router = express.Router();

// Get task details
router.get('/tasks/:taskId', getTask);

// Get subtasks for a task
router.get('/tasks/:taskId/subtasks', getSubTasks);

// Handle 404s for unknown routes
router.use('*', (_req, res) => {
  res.status(404).json({ message: 'ClickUp endpoint not found' });
});

export default router;
