/**
 * Get rate by role
 */
export declare const getRateByRole: (role: string) => Promise<any>;
/**
 * Get all rates
 */
export declare const getAllRates: () => Promise<any>;
/**
 * Get fixed rates only
 */
export declare const getFixedRates: () => Promise<any>;
/**
 * Get variable rates only
 */
export declare const getVariableRates: () => Promise<any>;
/**
 * Update contractor rate
 */
export declare const updateRate: (role: string, data: {
    baseRate?: number;
    chargeOutRate?: number;
    isFixed?: boolean;
}) => Promise<any>;
/**
 * Initialize default contractor rates
 */
export declare const initializeDefaultRates: () => Promise<void>;
/**
 * Validate rate for a given role
 */
export declare const validateRateForRole: (role: string, rate: number) => Promise<boolean>;
/**
 * Create a new contractor rate
 */
export declare const createRate: (data: {
    role: string;
    baseRate: number;
    chargeOutRate: number;
    isFixed?: boolean;
}) => Promise<any>;
/**
 * Delete a contractor rate
 */
export declare const deleteRate: (role: string) => Promise<any>;
declare const _default: {
    getRateByRole: (role: string) => Promise<any>;
    getAllRates: () => Promise<any>;
    getFixedRates: () => Promise<any>;
    getVariableRates: () => Promise<any>;
    updateRate: (role: string, data: {
        baseRate?: number;
        chargeOutRate?: number;
        isFixed?: boolean;
    }) => Promise<any>;
    initializeDefaultRates: () => Promise<void>;
    validateRateForRole: (role: string, rate: number) => Promise<boolean>;
    createRate: (data: {
        role: string;
        baseRate: number;
        chargeOutRate: number;
        isFixed?: boolean;
    }) => Promise<any>;
    deleteRate: (role: string) => Promise<any>;
};
export default _default;
