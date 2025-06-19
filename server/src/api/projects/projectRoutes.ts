import express from 'express';
import * as projectController from './projectController';
import { validateProjectId, validateClickUpId } from './projectValidation';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = express.Router();

/**
 * Get all projects
 */
router.get('/', projectController.getProjects);

/**
 * Create new project
 */
router.post('/', projectController.createProject);

/**
 * Check if project exists by ClickUp ID
 */
router.get('/check/:clickUpId', authenticateToken, validateClickUpId, projectController.checkProjectExists);

/**
 * Get project by ID
 */
router.get('/:id', validateProjectId, projectController.getProjectById);

/**
 * Update project
 */
router.patch('/:id', validateProjectId, projectController.updateProject);

/**
 * Save project progress
 */
router.patch('/:id/progress', validateProjectId, projectController.saveProgress);

/**
 * Delete project
 */
router.delete('/:id', validateProjectId, projectController.deleteProject);

// Handle 404s for unknown routes
router.use('*', (_req, res) => {
  res.status(404).json({ message: 'Project endpoint not found' });
});

export default router;
