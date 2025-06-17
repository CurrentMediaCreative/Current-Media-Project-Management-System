import { Request, Response } from 'express';
import contractorRateService from '../../services/contractorRateService';
import { ContractorRole, ContractorRate } from '@shared/types';
import { ApiError } from '../../utils';

/**
 * Get all contractor rates
 */
export const getAllRates = async (_req: Request, res: Response) => {
  try {
    const rates = await contractorRateService.getAllRates();
    res.json(rates);
  } catch (error) {
    console.error('Error getting rates:', error);
    res.status(500).json({ message: 'Error retrieving rates' });
  }
};

/**
 * Get fixed rates only
 */
export const getFixedRates = async (_req: Request, res: Response) => {
  try {
    const rates = await contractorRateService.getFixedRates();
    res.json(rates);
  } catch (error) {
    console.error('Error getting fixed rates:', error);
    res.status(500).json({ message: 'Error retrieving fixed rates' });
  }
};

/**
 * Get variable rates only
 */
export const getVariableRates = async (_req: Request, res: Response) => {
  try {
    const rates = await contractorRateService.getVariableRates();
    res.json(rates);
  } catch (error) {
    console.error('Error getting variable rates:', error);
    res.status(500).json({ message: 'Error retrieving variable rates' });
  }
};

/**
 * Update contractor rate
 */
export const updateRate = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const { baseRate, chargeOutRate, isFixed } = req.body;

    if (!Object.values(ContractorRole).includes(role as ContractorRole)) {
      throw new ApiError(400, 'Invalid contractor role');
    }

    const updatedRate = await contractorRateService.updateRate(role as ContractorRole, {
      baseRate,
      chargeOutRate,
      isFixed,
    });

    res.json(updatedRate);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error updating rate:', error);
      res.status(500).json({ message: 'Error updating rate' });
    }
  }
};

/**
 * Calculate project costs based on team configuration
 */
export const calculateProjectCosts = async (req: Request, res: Response) => {
  try {
    const { team } = req.body;

    // Validate team configuration
    if (!Array.isArray(team)) {
      throw new ApiError(400, 'Team must be an array');
    }

    let totalCost = 0;
    const breakdown = [];

    for (const member of team) {
      const { role, hours = 0, days = 0 } = member;
      const rate = await contractorRateService.getRateByRole(role as ContractorRole);
      
      // Calculate cost based on hours or days
      const cost = hours > 0 
        ? hours * rate.chargeOutRate
        : days * (rate.chargeOutRate * 8); // Assuming 8 hours per day

      totalCost += cost;
      breakdown.push({
        role,
        hours,
        days,
        rate: rate.chargeOutRate,
        cost,
      });
    }

    res.json({
      totalCost,
      breakdown,
      hst: totalCost * 0.13,
      total: totalCost * 1.13,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error calculating costs:', error);
      res.status(500).json({ message: 'Error calculating project costs' });
    }
  }
};

/**
 * Calculate profit margin for a project
 */
export const calculateProfitMargin = async (req: Request, res: Response) => {
  try {
    const { revenue, team } = req.body;

    if (!Array.isArray(team)) {
      throw new ApiError(400, 'Team must be an array');
    }

    let totalCost = 0;
    const breakdown = [];

    for (const member of team) {
      const { role, hours = 0, days = 0 } = member;
      const rate = await contractorRateService.getRateByRole(role as ContractorRole);
      
      // Calculate cost using base rate
      const cost = hours > 0 
        ? hours * rate.baseRate
        : days * (rate.baseRate * 8);

      totalCost += cost;
      breakdown.push({
        role,
        hours,
        days,
        baseRate: rate.baseRate,
        cost,
      });
    }

    const profit = revenue - totalCost;
    const margin = (profit / revenue) * 100;

    res.json({
      revenue,
      totalCost,
      profit,
      margin: Math.round(margin * 100) / 100, // Round to 2 decimal places
      breakdown,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error calculating profit margin:', error);
      res.status(500).json({ message: 'Error calculating profit margin' });
    }
  }
};

/**
 * Suggest team configuration based on budget
 */
export const suggestTeamConfiguration = async (req: Request, res: Response) => {
  try {
    const { budget, projectType } = req.body;

    if (!budget || budget <= 0) {
      throw new ApiError(400, 'Valid budget is required');
    }

    if (!projectType) {
      throw new ApiError(400, 'Project type is required');
    }

    // Get all fixed rates
    const rates = await contractorRateService.getFixedRates();

    // Basic team suggestions based on project type and budget
    let suggestedTeam = [];
    const budgetWithoutHST = budget / 1.13;

    switch (projectType.toLowerCase()) {
      case 'video':
        // Basic video team
        suggestedTeam = [
          { role: ContractorRole.SHOOTER, days: 1 },
          { role: ContractorRole.JUNIOR_EDITOR, hours: 16 },
        ];
        break;

      case 'photography':
        suggestedTeam = [
          { role: ContractorRole.PHOTOGRAPHER, days: 1 },
        ];
        break;

      case 'complex_video':
        suggestedTeam = [
          { role: ContractorRole.PRODUCER, days: 1 },
          { role: ContractorRole.SHOOTER, days: 2 },
          { role: ContractorRole.SOUND_ENGINEER, days: 2 },
          { role: ContractorRole.SENIOR_EDITOR, hours: 24 },
        ];
        break;

      default:
        throw new ApiError(400, 'Unsupported project type');
    }

    // Calculate costs for suggested team
    let totalCost = 0;
    const breakdown = [];

    for (const member of suggestedTeam) {
      const rate = rates.find((r: ContractorRate) => r.role === member.role);
      if (!rate) continue;

      const cost = member.hours
        ? member.hours * rate.chargeOutRate
        : member.days! * (rate.chargeOutRate * 8);

      totalCost += cost;
      breakdown.push({
        ...member,
        ratePerUnit: rate.chargeOutRate,
        cost,
      });
    }

    // Adjust team if over budget
    if (totalCost > budgetWithoutHST) {
      // Simplified adjustment: just mark as over budget
      // In a real implementation, you might want to suggest alternative configurations
      res.json({
        status: 'over_budget',
        suggestedTeam: breakdown,
        totalCost,
        budgetDifference: totalCost - budgetWithoutHST,
        message: 'Suggested team exceeds budget. Consider reducing team size or duration.',
      });
    } else {
      res.json({
        status: 'within_budget',
        suggestedTeam: breakdown,
        totalCost,
        budgetRemaining: budgetWithoutHST - totalCost,
        hst: totalCost * 0.13,
        totalWithHST: totalCost * 1.13,
      });
    }
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error suggesting team:', error);
      res.status(500).json({ message: 'Error generating team suggestion' });
    }
  }
};

export default {
  getAllRates,
  getFixedRates,
  getVariableRates,
  updateRate,
  calculateProjectCosts,
  calculateProfitMargin,
  suggestTeamConfiguration,
};
