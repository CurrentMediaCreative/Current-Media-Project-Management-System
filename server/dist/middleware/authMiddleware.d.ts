import { Request, Response, NextFunction, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
export interface AuthUser {
    userId: string;
    email: string;
    role: string;
}
export interface AuthenticatedRequest extends Request {
    user: AuthUser;
}
export interface JWTUser extends JwtPayload {
    id: string;
    email: string;
    role: string;
}
export declare const authenticate: RequestHandler;
export declare const authorize: (roles: string[]) => RequestHandler;
export type AsyncRequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void | Response>;
export declare const asyncHandler: (fn: AsyncRequestHandler) => RequestHandler;
