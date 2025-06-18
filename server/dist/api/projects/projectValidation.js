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
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ max: 100 })
        .withMessage('Project title must be at most 100 characters'),
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
    (0, express_validator_1.body)('startDate')
        .isISO8601()
        .withMessage('Start date must be a valid date')
        .toDate(),
    (0, express_validator_1.body)('endDate')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .toDate()
        .custom((endDate, { req }) => {
        const startDate = req.body.startDate;
        return new Date(endDate) >= new Date(startDate);
    })
        .withMessage('End date must be after or equal to start date'),
    exports.validateRequest,
];
// Validation rules for updating a project
exports.validateUpdateProject = [
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid project ID'),
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Project title cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Project title must be at most 100 characters'),
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
    (0, express_validator_1.body)('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date')
        .toDate(),
    (0, express_validator_1.body)('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .toDate()
        .custom((endDate, { req }) => {
        if (!req.body.startDate) {
            return true; // Skip validation if start date is not provided
        }
        return new Date(endDate) >= new Date(req.body.startDate);
    })
        .withMessage('End date must be after or equal to start date'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['NEW_NOT_SENT', 'NEW_SENT', 'PENDING_CLICKUP', 'ACTIVE', 'COMPLETED', 'ARCHIVED'])
        .withMessage('Invalid project status'),
    (0, express_validator_1.body)('clickupId')
        .optional()
        .isString()
        .withMessage('ClickUp ID must be a string'),
    exports.validateRequest,
];
// Validation rules for getting a project by ID
exports.validateProjectId = [
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid project ID'),
    exports.validateRequest,
];
//# sourceMappingURL=projectValidation.js.map