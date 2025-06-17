import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@shared/types';
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
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Middleware to check if user has required role
 */
export declare const authorize: (roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware to check if user is accessing their own resource
 * or has admin privileges
 */
export declare const authorizeOwnerOrAdmin: (userIdParam?: string) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
