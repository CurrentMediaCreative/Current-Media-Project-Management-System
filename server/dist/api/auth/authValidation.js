"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordReset = exports.validatePasswordResetRequest = exports.validateRefreshToken = exports.validateGoogleLogin = exports.validateLogin = exports.validateRegistration = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
// Middleware to check validation results
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validateRequest = validateRequest;
// Validation rules for user registration
exports.validateRegistration = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    exports.validateRequest,
];
// Validation rules for user login
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    exports.validateRequest,
];
// Validation rules for Google login
exports.validateGoogleLogin = [
    (0, express_validator_1.body)('token').notEmpty().withMessage('Google token is required'),
    exports.validateRequest,
];
// Validation rules for token refresh
exports.validateRefreshToken = [
    (0, express_validator_1.body)('refreshToken').notEmpty().withMessage('Refresh token is required'),
    exports.validateRequest,
];
// Validation rules for password reset request
exports.validatePasswordResetRequest = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    exports.validateRequest,
];
// Validation rules for password reset
exports.validatePasswordReset = [
    (0, express_validator_1.body)('token').notEmpty().withMessage('Reset token is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    exports.validateRequest,
];
//# sourceMappingURL=authValidation.js.map