import express from 'express';
import * as projectController from './projectController';
import { validateProjectId } from './projectValidation';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = express.Router();

/**
 * Get all projects
 */
router.get('/', projectController.getProjects);

/**
 * Get project by ID
 */
router.get('/:id', validateProjectId, projectController.getProjectById);

/**
 * Create new project
 */
router.post('/', projectController.createProject);

/**
 * Update project
 */
router.put('/:id', validateProjectId, projectController.updateProject);

/**
 * Delete project
 */
router.delete('/:id', validateProjectId, projectController.deleteProject);

/**
 * Check if project exists by ClickUp ID
 */
router.get('/check/:clickUpId', authenticateToken, projectController.checkProjectExists);

export default router;
