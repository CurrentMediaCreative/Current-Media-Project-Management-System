import { Request, Response } from 'express';
import { storage } from '../../services/storageService';

interface ContractorRate {
  id: string;
  contractorName: string;
  rate: number;
  currency: string;
  [key: string]: any;
}

/**
 * Get all contractor rates
 */
export const getContractorRates = async (_req: Request, res: Response) => {
  try {
    const rates = await storage.read<ContractorRate[]>('contractors.json');
    res.json(rates);
  } catch (error) {
    console.error('Error getting contractor rates:', error);
    res.status(500).json({ message: 'Error getting contractor rates' });
  }
};

/**
 * Create new contractor rate
 */
export const createContractorRate = async (req: Request, res: Response) => {
  try {
    const rates = await storage.read<ContractorRate[]>('contractors.json');
    const newRate = {
      id: Date.now().toString(),
      ...req.body
    };
    
    rates.push(newRate);
    await storage.write('contractors.json', rates);
    
    res.status(201).json(newRate);
  } catch (error) {
    console.error('Error creating contractor rate:', error);
    res.status(500).json({ message: 'Error creating contractor rate' });
  }
};

/**
 * Update contractor rate
 */
export const updateContractorRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rates = await storage.read<ContractorRate[]>('contractors.json');
    
    const updatedRates = rates.map(rate => 
      rate.id === id ? { ...rate, ...req.body } : rate
    );

    await storage.write('contractors.json', updatedRates);
    const updatedRate = updatedRates.find(rate => rate.id === id);
    
    if (!updatedRate) {
      return res.status(404).json({ message: 'Contractor rate not found' });
    }
    
    res.json(updatedRate);
  } catch (error) {
    console.error('Error updating contractor rate:', error);
    res.status(500).json({ message: 'Error updating contractor rate' });
  }
};

/**
 * Delete contractor rate
 */
export const deleteContractorRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rates = await storage.read<ContractorRate[]>('contractors.json');
    
    const updatedRates = rates.filter(rate => rate.id !== id);
    
    if (rates.length === updatedRates.length) {
      return res.status(404).json({ message: 'Contractor rate not found' });
    }

    await storage.write('contractors.json', updatedRates);
    res.json({ message: 'Contractor rate deleted successfully' });
  } catch (error) {
    console.error('Error deleting contractor rate:', error);
    res.status(500).json({ message: 'Error deleting contractor rate' });
  }
};
