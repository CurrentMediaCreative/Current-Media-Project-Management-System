import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils';
import { storage } from './storageService';
import { ContractorRate, CreateContractorRateInput, UpdateContractorRateInput } from '../types/contractor';

const CONTRACTORS_FILE = 'contractors.json';

/**
 * Get rate by role
 */
export const getRateByRole = async (role: string): Promise<ContractorRate> => {
  const rates = await storage.read<ContractorRate[]>(CONTRACTORS_FILE);
  const rate = rates.find(r => r.role === role);
  if (!rate) {
    throw new ApiError(404, `Rate not found for role: ${role}`);
  }
  return rate;
};

/**
 * Get all rates
 */
export const getAllRates = async (): Promise<ContractorRate[]> => {
  return storage.read<ContractorRate[]>(CONTRACTORS_FILE);
};

/**
 * Get fixed rates only
 */
export const getFixedRates = async (): Promise<ContractorRate[]> => {
  const rates = await storage.read<ContractorRate[]>(CONTRACTORS_FILE);
  return rates.filter(rate => rate.isFixed);
};

/**
 * Get variable rates only
 */
export const getVariableRates = async (): Promise<ContractorRate[]> => {
  const rates = await storage.read<ContractorRate[]>(CONTRACTORS_FILE);
  return rates.filter(rate => !rate.isFixed);
};

/**
 * Update contractor rate
 */
export const updateRate = async (
  role: string,
  data: UpdateContractorRateInput
): Promise<ContractorRate> => {
  const rates = await storage.read<ContractorRate[]>(CONTRACTORS_FILE);
  const index = rates.findIndex(r => r.role === role);
  
  if (index === -1) {
    throw new ApiError(404, `Rate not found for role: ${role}`);
  }

  // Validate rates are positive numbers
  if (data.baseRate !== undefined && data.baseRate < 0) {
    throw new ApiError(400, 'Base rate cannot be negative');
  }
  if (data.chargeOutRate !== undefined && data.chargeOutRate < 0) {
    throw new ApiError(400, 'Charge out rate cannot be negative');
  }

  const updatedRate = {
    ...rates[index],
    ...data,
    updatedAt: new Date().toISOString()
  };

  rates[index] = updatedRate;
  await storage.write(CONTRACTORS_FILE, rates);

  return updatedRate;
};

/**
 * Initialize default contractor rates
 */
export const initializeDefaultRates = async (): Promise<void> => {
  const defaultRates: CreateContractorRateInput[] = [
    { role: 'PRODUCER', baseRate: 75, chargeOutRate: 112.5, isFixed: true },
    { role: 'SHOOTER', baseRate: 65, chargeOutRate: 97.5, isFixed: true },
    { role: 'PHOTOGRAPHER', baseRate: 60, chargeOutRate: 90, isFixed: true },
    { role: 'SOUND_ENGINEER', baseRate: 55, chargeOutRate: 82.5, isFixed: true },
    { role: 'SENIOR_EDITOR', baseRate: 70, chargeOutRate: 105, isFixed: true },
    { role: 'JUNIOR_EDITOR', baseRate: 45, chargeOutRate: 67.5, isFixed: true }
  ];

  const rates = await storage.read<ContractorRate[]>(CONTRACTORS_FILE);
  
  for (const rate of defaultRates) {
    const existing = rates.find(r => r.role === rate.role);
    if (!existing) {
      const newRate: ContractorRate = {
        id: uuidv4(),
        role: rate.role,
        baseRate: rate.baseRate,
        chargeOutRate: rate.chargeOutRate,
        isFixed: rate.isFixed ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      rates.push(newRate);
    }
  }

  await storage.write(CONTRACTORS_FILE, rates);
};

/**
 * Validate rate for a given role
 */
export const validateRateForRole = async (role: string, rate: number): Promise<boolean> => {
  const rateConfig = await getRateByRole(role);

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
export const createRate = async (data: CreateContractorRateInput): Promise<ContractorRate> => {
  const rates = await storage.read<ContractorRate[]>(CONTRACTORS_FILE);
  
  // Validate role is unique
  const existingRate = rates.find(r => r.role === data.role);
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

  const newRate: ContractorRate = {
    id: uuidv4(),
    ...data,
    isFixed: data.isFixed ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  rates.push(newRate);
  await storage.write(CONTRACTORS_FILE, rates);

  return newRate;
};

/**
 * Delete a contractor rate
 */
export const deleteRate = async (role: string): Promise<void> => {
  const rates = await storage.read<ContractorRate[]>(CONTRACTORS_FILE);
  const index = rates.findIndex(r => r.role === role);
  
  if (index === -1) {
    throw new ApiError(404, `Rate not found for role: ${role}`);
  }

  rates.splice(index, 1);
  await storage.write(CONTRACTORS_FILE, rates);
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
