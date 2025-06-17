"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectId = exports.validateUpdateProject = exports.validateCreateProject = exports.validateRequest = void 0;
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
// Validation rules for creating a project
exports.validateCreateProject = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ max: 100 })
        .withMessage('Project name must be at most 100 characters'),
    (0, express_validator_1.body)('client')
        .trim()
        .notEmpty()
        .withMessage('Client name is required')
        .isLength({ max: 100 })
        .withMessage('Client name must be at most 100 characters'),
    (0, express_validator_1.body)('budget')
        .isNumeric()
        .withMessage('Budget must be a number')
        .custom((value) => value >= 0)
        .withMessage('Budget must be a positive number'),
    (0, express_validator_1.body)('scope')
        .trim()
        .notEmpty()
        .withMessage('Project scope is required'),
    (0, express_validator_1.body)('deliverables')
        .trim()
        .notEmpty()
        .withMessage('Project deliverables are required'),
    (0, express_validator_1.body)('timeframe.startDate')
        .isISO8601()
        .withMessage('Start date must be a valid date')
        .toDate(),
    (0, express_validator_1.body)('timeframe.endDate')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .toDate()
        .custom((endDate, { req }) => {
        const startDate = req.body.timeframe.startDate;
        return new Date(endDate) >= new Date(startDate);
    })
        .withMessage('End date must be after or equal to start date'),
    exports.validateRequest,
];
// Validation rules for updating a project
exports.validateUpdateProject = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid project ID'),
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Project name cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Project name must be at most 100 characters'),
    (0, express_validator_1.body)('client')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Client name cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Client name must be at most 100 characters'),
    (0, express_validator_1.body)('budget')
        .optional()
        .isNumeric()
        .withMessage('Budget must be a number')
        .custom((value) => value >= 0)
        .withMessage('Budget must be a positive number'),
    (0, express_validator_1.body)('scope')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Project scope cannot be empty'),
    (0, express_validator_1.body)('deliverables')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Project deliverables cannot be empty'),
    (0, express_validator_1.body)('timeframe.startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date')
        .toDate(),
    (0, express_validator_1.body)('timeframe.endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .toDate()
        .custom((endDate, { req }) => {
        if (!req.body.timeframe || !req.body.timeframe.startDate) {
            return true; // Skip validation if start date is not provided
        }
        const startDate = req.body.timeframe.startDate;
        return new Date(endDate) >= new Date(startDate);
    })
        .withMessage('End date must be after or equal to start date'),
    exports.validateRequest,
];
// Validation rules for getting a project by ID
exports.validateProjectId = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid project ID'),
    exports.validateRequest,
];
//# sourceMappingURL=projectValidation.js.map