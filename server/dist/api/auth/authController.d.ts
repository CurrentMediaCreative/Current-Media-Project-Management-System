import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
/**
 * Register a new user
 * @route POST /api/auth/register
 */
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Login user
 * @route POST /api/auth/login
 */
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Refresh access token
 * @route POST /api/auth/refresh
 */
export declare const refreshToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export declare const getProfile: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Logout user (client-side only)
 * @route POST /api/auth/logout
 */
export declare const logout: (_req: Request, res: Response) => void;
/**
 * Google login/signup
 * @route POST /api/auth/google
 */
export declare const googleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
