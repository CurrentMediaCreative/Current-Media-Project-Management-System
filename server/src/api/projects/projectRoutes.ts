import express from 'express';
import * as projectController from './projectController';
import { validateProjectId } from './projectValidation';

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

export default router;
