import express from 'express';
import * as emailController from './emailController';

const router = express.Router();

/**
 * Send project update email
 */
router.post('/project-update', emailController.sendProjectUpdate);

/**
 * Send contractor notification
 */
router.post('/contractor-notification', emailController.sendContractorNotification);

export default router;
