import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  checkProjectExists,
  pollClickUpData,
  linkClickUpTask,
  unlinkClickUpTask
} from './projectController';
import { validateProject } from './projectValidation';

const router = express.Router();

// Project existence check
router.get('/exists/:name', authMiddleware, checkProjectExists);

// ClickUp data polling
router.get('/poll-clickup', authMiddleware, pollClickUpData);

// Create a new project
router.post('/', authMiddleware, validateProject, createProject);

// Get all projects
router.get('/', authMiddleware, getProjects);

// Get a specific project
router.get('/:id', authMiddleware, getProjectById);

// Update a project
router.put('/:id', authMiddleware, validateProject, updateProject);

// Delete a project
router.delete('/:id', authMiddleware, deleteProject);

// Link ClickUp task (by name matching)
router.post('/:id/clickup/:taskName', authMiddleware, linkClickUpTask);

// Unlink ClickUp task
router.delete('/:id/clickup', authMiddleware, unlinkClickUpTask);

export default router;
