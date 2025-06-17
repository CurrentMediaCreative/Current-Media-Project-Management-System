"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeOwnerOrAdmin = exports.authorize = exports.authenticate = void 0;
const authService_1 = require("../services/authService");
const client_1 = require("@prisma/client");
const types_1 = require("@shared/types");
const prisma = new client_1.PrismaClient();
/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = async (req, res, next) => {
    try {
        // Get authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Extract and verify token
        const token = (0, authService_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            return res.status(401).json({ message: 'Invalid authentication token format' });
        }
        const payload = (0, authService_1.verifyToken)(token);
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
            role: payload.role,
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error during authentication' });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware to check if user has required role
 */
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
};
exports.authorize = authorize;
/**
 * Middleware to check if user is accessing their own resource
 * or has admin privileges
 */
const authorizeOwnerOrAdmin = (userIdParam = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const resourceUserId = req.params[userIdParam];
        const isOwner = req.user.userId === resourceUserId;
        const isAdmin = req.user.role === types_1.UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
};
exports.authorizeOwnerOrAdmin = authorizeOwnerOrAdmin;
//# sourceMappingURL=authMiddleware.js.map