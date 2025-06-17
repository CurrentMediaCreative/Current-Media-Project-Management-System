"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractorRateController_1 = __importDefault(require("./contractorRateController"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const types_1 = require("@shared/types");
const router = express_1.default.Router();
// Get all rates
router.get('/', authMiddleware_1.authenticate, contractorRateController_1.default.getAllRates);
// Get fixed rates
router.get('/fixed', authMiddleware_1.authenticate, contractorRateController_1.default.getFixedRates);
// Get variable rates
router.get('/variable', authMiddleware_1.authenticate, contractorRateController_1.default.getVariableRates);
// Update rate (admin only)
router.put('/:role', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN]), contractorRateController_1.default.updateRate);
// Calculate project costs
router.post('/calculate-costs', authMiddleware_1.authenticate, contractorRateController_1.default.calculateProjectCosts);
// Calculate profit margin
router.post('/calculate-margin', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), contractorRateController_1.default.calculateProfitMargin);
// Get team suggestions
router.post('/suggest-team', authMiddleware_1.authenticate, contractorRateController_1.default.suggestTeamConfiguration);
exports.default = router;
//# sourceMappingURL=contractorRateRoutes.js.map