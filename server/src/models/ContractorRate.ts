import { v4 as uuidv4 } from 'uuid';
import { storage } from '../services/storageService';

export interface ContractorRate {
  id: string;
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type CreateContractorRateInput = {
  role: string;
  baseRate: number;
  chargeOutRate?: number;
  isFixed?: boolean;
};

type UpdateContractorRateInput = Partial<CreateContractorRateInput>;

const STORAGE_KEY = 'contractor-rates';

export const ContractorRateModel = {
  async create(data: CreateContractorRateInput): Promise<ContractorRate> {
    const rates = await storage.read<ContractorRate[]>(STORAGE_KEY) || [];
    
    // Check for existing rate with same role
    if (rates.some((rate: ContractorRate) => rate.role === data.role)) {
      throw new Error(`Contractor rate for role ${data.role} already exists`);
    }

    const now = new Date();
    const newRate: ContractorRate = {
      id: uuidv4(),
      role: data.role,
      baseRate: data.baseRate,
      chargeOutRate: data.chargeOutRate ?? data.baseRate * 1.5,
      isFixed: data.isFixed ?? false,
      createdAt: now,
      updatedAt: now
    };

    rates.push(newRate);
    await storage.write(STORAGE_KEY, rates);
    return newRate;
  },

  async findById(id: string): Promise<ContractorRate | null> {
    const rates = await storage.read<ContractorRate[]>(STORAGE_KEY) || [];
    return rates.find((rate: ContractorRate) => rate.id === id) || null;
  },

  async findByRole(role: string): Promise<ContractorRate | null> {
    const rates = await storage.read<ContractorRate[]>(STORAGE_KEY) || [];
    return rates.find((rate: ContractorRate) => rate.role === role) || null;
  },

  async findAll(): Promise<ContractorRate[]> {
    const rates = await storage.read<ContractorRate[]>(STORAGE_KEY) || [];
    return rates.sort((a: ContractorRate, b: ContractorRate) => a.role.localeCompare(b.role));
  },

  async update(id: string, data: UpdateContractorRateInput): Promise<ContractorRate> {
    const rates = await storage.read<ContractorRate[]>(STORAGE_KEY) || [];
    const index = rates.findIndex((rate: ContractorRate) => rate.id === id);
    
    if (index === -1) {
      throw new Error(`Contractor rate with id ${id} not found`);
    }

    const currentRate = rates[index];
    const updatedRate: ContractorRate = {
      ...currentRate,
      ...data,
      updatedAt: new Date()
    };

    // Update chargeOutRate if baseRate changes and rate is not fixed
    if (typeof data.baseRate === 'number' && !currentRate.isFixed && typeof data.chargeOutRate !== 'number') {
      updatedRate.chargeOutRate = data.baseRate * 1.5;
    }

    rates[index] = updatedRate;
    await storage.write(STORAGE_KEY, rates);
    return updatedRate;
  },

  async updateRate(role: string, baseRate: number, chargeOutRate?: number): Promise<ContractorRate> {
    const rates = await storage.read<ContractorRate[]>(STORAGE_KEY) || [];
    const index = rates.findIndex((rate: ContractorRate) => rate.role === role);
    
    if (index === -1) {
      throw new Error(`Contractor rate with role ${role} not found`);
    }

    const currentRate = rates[index];
    const updatedRate: ContractorRate = {
      ...currentRate,
      baseRate,
      chargeOutRate: chargeOutRate ?? baseRate * 1.5,
      updatedAt: new Date()
    };

    rates[index] = updatedRate;
    await storage.write(STORAGE_KEY, rates);
    return updatedRate;
  },

  async delete(id: string): Promise<void> {
    const rates = await storage.read<ContractorRate[]>(STORAGE_KEY) || [];
    const filteredRates = rates.filter((rate: ContractorRate) => rate.id !== id);
    
    if (filteredRates.length === rates.length) {
      throw new Error(`Contractor rate with id ${id} not found`);
    }

    await storage.write(STORAGE_KEY, filteredRates);
  }
};
