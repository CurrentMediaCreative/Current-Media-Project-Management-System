import { PrismaClient } from '@prisma/client';
import { ContractorRate } from '../models/ContractorRate';
import { ApiError } from '../utils';

const prisma = new PrismaClient();

/**
 * Get rate by role
 */
export const getRateByRole = async (role: string) => {
  const rate = await ContractorRate.findByRole(role);
  if (!rate) {
    throw new ApiError(404, `Rate not found for role: ${role}`);
  }
  return rate;
};

/**
 * Get all rates
 */
export const getAllRates = async () => {
  return ContractorRate.list();
};

/**
 * Get fixed rates only
 */
export const getFixedRates = async () => {
  return ContractorRate.listFixedRates();
};

/**
 * Get variable rates only
 */
export const getVariableRates = async () => {
  return ContractorRate.listVariableRates();
};

/**
 * Update contractor rate
 */
export const updateRate = async (
  role: string,
  data: {
    baseRate?: number;
    chargeOutRate?: number;
    isFixed?: boolean;
  }
) => {
  // Validate rate exists
  const existingRate = await ContractorRate.findByRole(role);
  if (!existingRate) {
    throw new ApiError(404, `Rate not found for role: ${role}`);
  }

  // Validate rates are positive numbers
  if (data.baseRate !== undefined && data.baseRate < 0) {
    throw new ApiError(400, 'Base rate cannot be negative');
  }
  if (data.chargeOutRate !== undefined && data.chargeOutRate < 0) {
    throw new ApiError(400, 'Charge out rate cannot be negative');
  }

  return ContractorRate.update(role, data);
};

/**
 * Initialize default contractor rates
 */
export const initializeDefaultRates = async () => {
  await ContractorRate.initializeDefaultRates();
};

/**
 * Validate rate for a given role
 */
export const validateRateForRole = async (role: string, rate: number) => {
  const rateConfig = await ContractorRate.findByRole(role);
  if (!rateConfig) {
    throw new ApiError(404, `Rate configuration not found for role: ${role}`);
  }

  if (rateConfig.isFixed && rate !== rateConfig.chargeOutRate) {
    throw new ApiError(
      400,
      `Invalid rate for ${role}. Must use fixed rate of ${rateConfig.chargeOutRate}`
    );
  }

  if (rate < 0) {
    throw new ApiError(400, 'Rate cannot be negative');
  }

  return true;
};

/**
 * Create a new contractor rate
 */
export const createRate = async (data: {
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed?: boolean;
}) => {
  // Validate role is unique
  const existingRate = await ContractorRate.findByRole(data.role);
  if (existingRate) {
    throw new ApiError(400, `Rate already exists for role: ${data.role}`);
  }

  // Validate rates are positive numbers
  if (data.baseRate < 0) {
    throw new ApiError(400, 'Base rate cannot be negative');
  }
  if (data.chargeOutRate < 0) {
    throw new ApiError(400, 'Charge out rate cannot be negative');
  }

  return ContractorRate.create(data);
};

/**
 * Delete a contractor rate
 */
export const deleteRate = async (role: string) => {
  // Validate rate exists
  const existingRate = await ContractorRate.findByRole(role);
  if (!existingRate) {
    throw new ApiError(404, `Rate not found for role: ${role}`);
  }

  return ContractorRate.delete(role);
};

export default {
  getRateByRole,
  getAllRates,
  getFixedRates,
  getVariableRates,
  updateRate,
  initializeDefaultRates,
  validateRateForRole,
  createRate,
  deleteRate,
};
