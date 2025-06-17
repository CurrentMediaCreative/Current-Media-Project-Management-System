import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware to check validation results
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for user registration
export const validateRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest,
];

// Validation rules for user login
export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
];

// Validation rules for Google login
export const validateGoogleLogin = [
  body('token').notEmpty().withMessage('Google token is required'),
  validateRequest,
];

// Validation rules for token refresh
export const validateRefreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  validateRequest,
];

// Validation rules for password reset request
export const validatePasswordResetRequest = [
  body('email').isEmail().withMessage('Valid email is required'),
  validateRequest,
];

// Validation rules for password reset
export const validatePasswordReset = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest,
];
