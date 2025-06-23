import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ProjectStatus } from '@shared/types/project';

const validStatuses = Object.values(ProjectStatus);

export const validateProject = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 255 })
    .withMessage('Project name must be less than 255 characters'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('Project status is required')
    .isIn(validStatuses)
    .withMessage('Invalid project status'),

  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number'),

  body('predictedCosts')
    .optional()
    .isNumeric()
    .withMessage('Predicted costs must be a number'),

  body('actualCosts')
    .optional()
    .isNumeric()
    .withMessage('Actual costs must be a number'),

  body('folderPath')
    .optional()
    .isString()
    .withMessage('Folder path must be a string'),

  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
