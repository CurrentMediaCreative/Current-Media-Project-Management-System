import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from './projectController';
import {
  validateCreateProject,
  validateUpdateProject,
  validateProjectId,
} from './projectValidation';
import { authenticate, authorize } from '../../middleware/authMiddleware';
import { UserRole } from '@shared/types';

const router = express.Router();

// Create a new project
router.post('/', authenticate, validateCreateProject, createProject);

// Get all projects
router.get('/', authenticate, getProjects);

// Get project by ID
router.get('/:id', authenticate, validateProjectId, getProjectById);

// Update project
router.put('/:id', authenticate, validateUpdateProject, updateProject);

// Delete project (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN]),
  validateProjectId,
  deleteProject
);

export default router;
