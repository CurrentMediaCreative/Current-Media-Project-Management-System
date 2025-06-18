import express from 'express';
import * as dashboardController from './dashboardController';

const router = express.Router();

/**
 * Get dashboard overview data
 */
router.get('/overview', dashboardController.getDashboardOverview);

/**
 * Get recent notifications
 */
router.get('/notifications', dashboardController.getNotifications);

/**
 * Mark notification as read
 */
router.put('/notifications/:id/read', dashboardController.markNotificationRead);

export default router;
