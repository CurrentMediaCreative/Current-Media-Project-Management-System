import { Request, Response } from 'express';
/**
 * Get all contractor rates
 */
export declare const getAllRates: (_req: Request, res: Response) => Promise<void>;
/**
 * Get fixed rates only
 */
export declare const getFixedRates: (_req: Request, res: Response) => Promise<void>;
/**
 * Get variable rates only
 */
export declare const getVariableRates: (_req: Request, res: Response) => Promise<void>;
/**
 * Update contractor rate
 */
export declare const updateRate: (req: Request, res: Response) => Promise<void>;
/**
 * Calculate project costs based on team configuration
 */
export declare const calculateProjectCosts: (req: Request, res: Response) => Promise<void>;
/**
 * Calculate profit margin for a project
 */
export declare const calculateProfitMargin: (req: Request, res: Response) => Promise<void>;
/**
 * Suggest team configuration based on budget
 */
export declare const suggestTeamConfiguration: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getAllRates: (_req: Request, res: Response) => Promise<void>;
    getFixedRates: (_req: Request, res: Response) => Promise<void>;
    getVariableRates: (_req: Request, res: Response) => Promise<void>;
    updateRate: (req: Request, res: Response) => Promise<void>;
    calculateProjectCosts: (req: Request, res: Response) => Promise<void>;
    calculateProfitMargin: (req: Request, res: Response) => Promise<void>;
    suggestTeamConfiguration: (req: Request, res: Response) => Promise<void>;
};
export default _default;
