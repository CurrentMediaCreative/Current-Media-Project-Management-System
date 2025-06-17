import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../services/authService';
import { PrismaClient } from '@prisma/client';
import { UserRole } from '@shared/types';

const prisma = new PrismaClient();

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Extract and verify token
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return res.status(401).json({ message: 'Invalid authentication token format' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Set user in request object
    req.user = {
      userId: payload.userId,
      role: payload.role as UserRole,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

/**
 * Middleware to check if user has required role
 */
export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

/**
 * Middleware to check if user is accessing their own resource
 * or has admin privileges
 */
export const authorizeOwnerOrAdmin = (userIdParam: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const resourceUserId = req.params[userIdParam];
    const isOwner = req.user.userId === resourceUserId;
    const isAdmin = req.user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
