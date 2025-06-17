"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestTeamConfiguration = exports.calculateProfitMargin = exports.calculateProjectCosts = exports.updateRate = exports.getVariableRates = exports.getFixedRates = exports.getAllRates = void 0;
const contractorRateService_1 = __importDefault(require("../../services/contractorRateService"));
const types_1 = require("@shared/types");
const utils_1 = require("../../utils");
/**
 * Get all contractor rates
 */
const getAllRates = async (_req, res) => {
    try {
        const rates = await contractorRateService_1.default.getAllRates();
        res.json(rates);
    }
    catch (error) {
        console.error('Error getting rates:', error);
        res.status(500).json({ message: 'Error retrieving rates' });
    }
};
exports.getAllRates = getAllRates;
/**
 * Get fixed rates only
 */
const getFixedRates = async (_req, res) => {
    try {
        const rates = await contractorRateService_1.default.getFixedRates();
        res.json(rates);
    }
    catch (error) {
        console.error('Error getting fixed rates:', error);
        res.status(500).json({ message: 'Error retrieving fixed rates' });
    }
};
exports.getFixedRates = getFixedRates;
/**
 * Get variable rates only
 */
const getVariableRates = async (_req, res) => {
    try {
        const rates = await contractorRateService_1.default.getVariableRates();
        res.json(rates);
    }
    catch (error) {
        console.error('Error getting variable rates:', error);
        res.status(500).json({ message: 'Error retrieving variable rates' });
    }
};
exports.getVariableRates = getVariableRates;
/**
 * Update contractor rate
 */
const updateRate = async (req, res) => {
    try {
        const { role } = req.params;
        const { baseRate, chargeOutRate, isFixed } = req.body;
        if (!Object.values(types_1.ContractorRole).includes(role)) {
            throw new utils_1.ApiError(400, 'Invalid contractor role');
        }
        const updatedRate = await contractorRateService_1.default.updateRate(role, {
            baseRate,
            chargeOutRate,
            isFixed,
        });
        res.json(updatedRate);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            console.error('Error updating rate:', error);
            res.status(500).json({ message: 'Error updating rate' });
        }
    }
};
exports.updateRate = updateRate;
/**
 * Calculate project costs based on team configuration
 */
const calculateProjectCosts = async (req, res) => {
    try {
        const { team } = req.body;
        // Validate team configuration
        if (!Array.isArray(team)) {
            throw new utils_1.ApiError(400, 'Team must be an array');
        }
        let totalCost = 0;
        const breakdown = [];
        for (const member of team) {
            const { role, hours = 0, days = 0 } = member;
            const rate = await contractorRateService_1.default.getRateByRole(role);
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
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            console.error('Error calculating costs:', error);
            res.status(500).json({ message: 'Error calculating project costs' });
        }
    }
};
exports.calculateProjectCosts = calculateProjectCosts;
/**
 * Calculate profit margin for a project
 */
const calculateProfitMargin = async (req, res) => {
    try {
        const { revenue, team } = req.body;
        if (!Array.isArray(team)) {
            throw new utils_1.ApiError(400, 'Team must be an array');
        }
        let totalCost = 0;
        const breakdown = [];
        for (const member of team) {
            const { role, hours = 0, days = 0 } = member;
            const rate = await contractorRateService_1.default.getRateByRole(role);
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
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            console.error('Error calculating profit margin:', error);
            res.status(500).json({ message: 'Error calculating profit margin' });
        }
    }
};
exports.calculateProfitMargin = calculateProfitMargin;
/**
 * Suggest team configuration based on budget
 */
const suggestTeamConfiguration = async (req, res) => {
    try {
        const { budget, projectType } = req.body;
        if (!budget || budget <= 0) {
            throw new utils_1.ApiError(400, 'Valid budget is required');
        }
        if (!projectType) {
            throw new utils_1.ApiError(400, 'Project type is required');
        }
        // Get all fixed rates
        const rates = await contractorRateService_1.default.getFixedRates();
        // Basic team suggestions based on project type and budget
        let suggestedTeam = [];
        const budgetWithoutHST = budget / 1.13;
        switch (projectType.toLowerCase()) {
            case 'video':
                // Basic video team
                suggestedTeam = [
                    { role: types_1.ContractorRole.SHOOTER, days: 1 },
                    { role: types_1.ContractorRole.JUNIOR_EDITOR, hours: 16 },
                ];
                break;
            case 'photography':
                suggestedTeam = [
                    { role: types_1.ContractorRole.PHOTOGRAPHER, days: 1 },
                ];
                break;
            case 'complex_video':
                suggestedTeam = [
                    { role: types_1.ContractorRole.PRODUCER, days: 1 },
                    { role: types_1.ContractorRole.SHOOTER, days: 2 },
                    { role: types_1.ContractorRole.SOUND_ENGINEER, days: 2 },
                    { role: types_1.ContractorRole.SENIOR_EDITOR, hours: 24 },
                ];
                break;
            default:
                throw new utils_1.ApiError(400, 'Unsupported project type');
        }
        // Calculate costs for suggested team
        let totalCost = 0;
        const breakdown = [];
        for (const member of suggestedTeam) {
            const rate = rates.find((r) => r.role === member.role);
            if (!rate)
                continue;
            const cost = member.hours
                ? member.hours * rate.chargeOutRate
                : member.days * (rate.chargeOutRate * 8);
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
        }
        else {
            res.json({
                status: 'within_budget',
                suggestedTeam: breakdown,
                totalCost,
                budgetRemaining: budgetWithoutHST - totalCost,
                hst: totalCost * 0.13,
                totalWithHST: totalCost * 1.13,
            });
        }
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            console.error('Error suggesting team:', error);
            res.status(500).json({ message: 'Error generating team suggestion' });
        }
    }
};
exports.suggestTeamConfiguration = suggestTeamConfiguration;
exports.default = {
    getAllRates: exports.getAllRates,
    getFixedRates: exports.getFixedRates,
    getVariableRates: exports.getVariableRates,
    updateRate: exports.updateRate,
    calculateProjectCosts: exports.calculateProjectCosts,
    calculateProfitMargin: exports.calculateProfitMargin,
    suggestTeamConfiguration: exports.suggestTeamConfiguration,
};
//# sourceMappingURL=contractorRateController.js.map