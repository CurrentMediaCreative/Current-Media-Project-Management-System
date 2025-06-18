import express from 'express';
import * as contractorController from './contractorRateController';

const router = express.Router();

/**
 * Get all contractor rates
 */
router.get('/', contractorController.getContractorRates);

/**
 * Create new contractor rate
 */
router.post('/', contractorController.createContractorRate);

/**
 * Update contractor rate
 */
router.put('/:id', contractorController.updateContractorRate);

/**
 * Delete contractor rate
 */
router.delete('/:id', contractorController.deleteContractorRate);

export default router;
