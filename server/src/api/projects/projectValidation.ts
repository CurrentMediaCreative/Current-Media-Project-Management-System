import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware to check validation results
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for creating a project
export const validateCreateProject = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 100 })
    .withMessage('Project name must be at most 100 characters'),
  
  body('client')
    .trim()
    .notEmpty()
    .withMessage('Client name is required')
    .isLength({ max: 100 })
    .withMessage('Client name must be at most 100 characters'),
  
  body('budget')
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom((value) => value >= 0)
    .withMessage('Budget must be a positive number'),
  
  body('scope')
    .trim()
    .notEmpty()
    .withMessage('Project scope is required'),
  
  body('deliverables')
    .trim()
    .notEmpty()
    .withMessage('Project deliverables are required'),
  
  body('timeframe.startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),
  
  body('timeframe.endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .toDate()
    .custom((endDate, { req }) => {
      const startDate = req.body.timeframe.startDate;
      return new Date(endDate) >= new Date(startDate);
    })
    .withMessage('End date must be after or equal to start date'),
  
  validateRequest,
];

// Validation rules for updating a project
export const validateUpdateProject = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Project name must be at most 100 characters'),
  
  body('client')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Client name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Client name must be at most 100 characters'),
  
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom((value) => value >= 0)
    .withMessage('Budget must be a positive number'),
  
  body('scope')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project scope cannot be empty'),
  
  body('deliverables')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project deliverables cannot be empty'),
  
  body('timeframe.startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),
  
  body('timeframe.endDate')
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
  
  validateRequest,
];

// Validation rules for getting a project by ID
export const validateProjectId = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  validateRequest,
];
