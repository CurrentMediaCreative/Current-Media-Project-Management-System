"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("./authController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const authValidation_1 = require("./authValidation");
const router = express_1.default.Router();
// Public routes
router.post('/register', authValidation_1.validateRegistration, authController_1.register);
router.post('/login', authValidation_1.validateLogin, authController_1.login);
router.post('/google', authValidation_1.validateGoogleLogin, authController_1.googleLogin);
router.post('/refresh', authValidation_1.validateRefreshToken, authController_1.refreshToken);
router.post('/logout', authController_1.logout);
// Protected routes
router.get('/me', authMiddleware_1.authenticate, authController_1.getProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map