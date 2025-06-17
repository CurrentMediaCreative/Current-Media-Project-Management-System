"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRate = exports.createRate = exports.validateRateForRole = exports.initializeDefaultRates = exports.updateRate = exports.getVariableRates = exports.getFixedRates = exports.getAllRates = exports.getRateByRole = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
/**
 * Get rate by role
 */
const getRateByRole = async (role) => {
    const rate = await ContractorRate_1.ContractorRate.findByRole(role);
    if (!rate) {
        throw new utils_1.ApiError(404, `Rate not found for role: ${role}`);
    }
    return rate;
};
exports.getRateByRole = getRateByRole;
/**
 * Get all rates
 */
const getAllRates = async () => {
    return ContractorRate_1.ContractorRate.list();
};
exports.getAllRates = getAllRates;
/**
 * Get fixed rates only
 */
const getFixedRates = async () => {
    return ContractorRate_1.ContractorRate.listFixedRates();
};
exports.getFixedRates = getFixedRates;
/**
 * Get variable rates only
 */
const getVariableRates = async () => {
    return ContractorRate_1.ContractorRate.listVariableRates();
};
exports.getVariableRates = getVariableRates;
/**
 * Update contractor rate
 */
const updateRate = async (role, data) => {
    // Validate rate exists
    const existingRate = await ContractorRate_1.ContractorRate.findByRole(role);
    if (!existingRate) {
        throw new utils_1.ApiError(404, `Rate not found for role: ${role}`);
    }
    // Validate rates are positive numbers
    if (data.baseRate !== undefined && data.baseRate < 0) {
        throw new utils_1.ApiError(400, 'Base rate cannot be negative');
    }
    if (data.chargeOutRate !== undefined && data.chargeOutRate < 0) {
        throw new utils_1.ApiError(400, 'Charge out rate cannot be negative');
    }
    return ContractorRate_1.ContractorRate.update(role, data);
};
exports.updateRate = updateRate;
/**
 * Initialize default contractor rates
 */
const initializeDefaultRates = async () => {
    await ContractorRate_1.ContractorRate.initializeDefaultRates();
};
exports.initializeDefaultRates = initializeDefaultRates;
/**
 * Validate rate for a given role
 */
const validateRateForRole = async (role, rate) => {
    const rateConfig = await ContractorRate_1.ContractorRate.findByRole(role);
    if (!rateConfig) {
        throw new utils_1.ApiError(404, `Rate configuration not found for role: ${role}`);
    }
    if (rateConfig.isFixed && rate !== rateConfig.chargeOutRate) {
        throw new utils_1.ApiError(400, `Invalid rate for ${role}. Must use fixed rate of ${rateConfig.chargeOutRate}`);
    }
    if (rate < 0) {
        throw new utils_1.ApiError(400, 'Rate cannot be negative');
    }
    return true;
};
exports.validateRateForRole = validateRateForRole;
/**
 * Create a new contractor rate
 */
const createRate = async (data) => {
    // Validate role is unique
    const existingRate = await ContractorRate_1.ContractorRate.findByRole(data.role);
    if (existingRate) {
        throw new utils_1.ApiError(400, `Rate already exists for role: ${data.role}`);
    }
    // Validate rates are positive numbers
    if (data.baseRate < 0) {
        throw new utils_1.ApiError(400, 'Base rate cannot be negative');
    }
    if (data.chargeOutRate < 0) {
        throw new utils_1.ApiError(400, 'Charge out rate cannot be negative');
    }
    return ContractorRate_1.ContractorRate.create(data);
};
exports.createRate = createRate;
/**
 * Delete a contractor rate
 */
const deleteRate = async (role) => {
    // Validate rate exists
    const existingRate = await ContractorRate_1.ContractorRate.findByRole(role);
    if (!existingRate) {
        throw new utils_1.ApiError(404, `Rate not found for role: ${role}`);
    }
    return ContractorRate_1.ContractorRate.delete(role);
};
exports.deleteRate = deleteRate;
exports.default = {
    getRateByRole: exports.getRateByRole,
    getAllRates: exports.getAllRates,
    getFixedRates: exports.getFixedRates,
    getVariableRates: exports.getVariableRates,
    updateRate: exports.updateRate,
    initializeDefaultRates: exports.initializeDefaultRates,
    validateRateForRole: exports.validateRateForRole,
    createRate: exports.createRate,
    deleteRate: exports.deleteRate,
};
//# sourceMappingURL=contractorRateService.js.map