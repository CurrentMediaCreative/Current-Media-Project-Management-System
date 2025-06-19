import { Request, Response, NextFunction } from 'express';

export const validateProjectId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      message: 'Invalid project ID format',
      code: 'INVALID_PARAMETER'
    });
  }
  next();
};

export const validateClickUpId = (req: Request, res: Response, next: NextFunction) => {
  const { clickUpId } = req.params;
  if (!clickUpId || typeof clickUpId !== 'string') {
    return res.status(400).json({
      message: 'Invalid ClickUp ID format',
      code: 'INVALID_PARAMETER'
    });
  }
  next();
};
