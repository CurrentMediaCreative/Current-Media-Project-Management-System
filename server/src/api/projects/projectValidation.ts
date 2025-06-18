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
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Project title must be at most 100 characters'),
  
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
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .toDate()
    .custom((endDate, { req }) => {
      const startDate = req.body.startDate;
      return new Date(endDate) >= new Date(startDate);
    })
    .withMessage('End date must be after or equal to start date'),
  
  validateRequest,
];

// Validation rules for updating a project
export const validateUpdateProject = [
  param('id').isUUID().withMessage('Invalid project ID'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Project title must be at most 100 characters'),
  
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
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),
  
  body('endDate')
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
  
  body('status')
    .optional()
    .isIn(['NEW_NOT_SENT', 'NEW_SENT', 'PENDING_CLICKUP', 'ACTIVE', 'COMPLETED', 'ARCHIVED'])
    .withMessage('Invalid project status'),

  body('clickupId')
    .optional()
    .isString()
    .withMessage('ClickUp ID must be a string'),
  
  validateRequest,
];

// Validation rules for getting a project by ID
export const validateProjectId = [
  param('id').isUUID().withMessage('Invalid project ID'),
  validateRequest,
];
