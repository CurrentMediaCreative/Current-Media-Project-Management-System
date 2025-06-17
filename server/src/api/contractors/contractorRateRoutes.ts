import express from 'express';
import contractorRateController from './contractorRateController';
import { authenticate, authorize } from '../../middleware/authMiddleware';
import { UserRole } from '@shared/types';

const router = express.Router();

// Get all rates
router.get('/', authenticate, contractorRateController.getAllRates);

// Get fixed rates
router.get('/fixed', authenticate, contractorRateController.getFixedRates);

// Get variable rates
router.get('/variable', authenticate, contractorRateController.getVariableRates);

// Update rate (admin only)
router.put(
  '/:role',
  authenticate,
  authorize([UserRole.ADMIN]),
  contractorRateController.updateRate
);

// Calculate project costs
router.post(
  '/calculate-costs',
  authenticate,
  contractorRateController.calculateProjectCosts
);

// Calculate profit margin
router.post(
  '/calculate-margin',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  contractorRateController.calculateProfitMargin
);

// Get team suggestions
router.post(
  '/suggest-team',
  authenticate,
  contractorRateController.suggestTeamConfiguration
);

export default router;
