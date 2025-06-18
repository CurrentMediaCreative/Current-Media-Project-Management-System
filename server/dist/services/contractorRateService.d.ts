/**
 * Get rate by role
 */
export declare const getRateByRole: (role: string) => Promise<{
    id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    baseRate: number;
    chargeOutRate: number;
    isFixed: boolean;
}>;
/**
 * Get all rates
 */
export declare const getAllRates: () => Promise<{
    id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    baseRate: number;
    chargeOutRate: number;
    isFixed: boolean;
}[]>;
/**
 * Get fixed rates only
 */
export declare const getFixedRates: () => Promise<{
    id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    baseRate: number;
    chargeOutRate: number;
    isFixed: boolean;
}[]>;
/**
 * Get variable rates only
 */
export declare const getVariableRates: () => Promise<{
    id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    baseRate: number;
    chargeOutRate: number;
    isFixed: boolean;
}[]>;
/**
 * Update contractor rate
 */
export declare const updateRate: (role: string, data: {
    baseRate?: number;
    chargeOutRate?: number;
    isFixed?: boolean;
}) => Promise<{
    id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    baseRate: number;
    chargeOutRate: number;
    isFixed: boolean;
}>;
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
}) => Promise<{
    id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    baseRate: number;
    chargeOutRate: number;
    isFixed: boolean;
}>;
/**
 * Delete a contractor rate
 */
export declare const deleteRate: (role: string) => Promise<void>;
declare const _default: {
    getRateByRole: (role: string) => Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        baseRate: number;
        chargeOutRate: number;
        isFixed: boolean;
    }>;
    getAllRates: () => Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        baseRate: number;
        chargeOutRate: number;
        isFixed: boolean;
    }[]>;
    getFixedRates: () => Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        baseRate: number;
        chargeOutRate: number;
        isFixed: boolean;
    }[]>;
    getVariableRates: () => Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        baseRate: number;
        chargeOutRate: number;
        isFixed: boolean;
    }[]>;
    updateRate: (role: string, data: {
        baseRate?: number;
        chargeOutRate?: number;
        isFixed?: boolean;
    }) => Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        baseRate: number;
        chargeOutRate: number;
        isFixed: boolean;
    }>;
    initializeDefaultRates: () => Promise<void>;
    validateRateForRole: (role: string, rate: number) => Promise<boolean>;
    createRate: (data: {
        role: string;
        baseRate: number;
        chargeOutRate: number;
        isFixed?: boolean;
    }) => Promise<{
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        baseRate: number;
        chargeOutRate: number;
        isFixed: boolean;
    }>;
    deleteRate: (role: string) => Promise<void>;
};
export default _default;
