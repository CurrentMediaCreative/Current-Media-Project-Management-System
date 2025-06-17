"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.verifyToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Generate JWT tokens for authentication
 */
const generateTokens = (user) => {
    // Get JWT configuration from environment variables
    const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_dev';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    // Calculate expiration time in seconds
    const expiresIn = typeof jwtExpiresIn === 'string' && jwtExpiresIn.endsWith('d')
        ? parseInt(jwtExpiresIn.slice(0, -1)) * 24 * 60 * 60
        : 24 * 60 * 60; // Default to 1 day in seconds
    // Create token payload
    const payload = {
        userId: user.id,
        role: user.role,
    };
    // JWT sign options
    const signOptions = {
        expiresIn: expiresIn,
    };
    const refreshSignOptions = {
        expiresIn: typeof refreshExpiresIn === 'string' && refreshExpiresIn.endsWith('d')
            ? parseInt(refreshExpiresIn.slice(0, -1)) * 24 * 60 * 60
            : 7 * 24 * 60 * 60, // Default to 7 days in seconds
    };
    // Generate access token
    const accessToken = jsonwebtoken_1.default.sign(payload, jwtSecret, signOptions);
    // Generate refresh token
    const refreshToken = jsonwebtoken_1.default.sign(payload, jwtSecret, refreshSignOptions);
    return {
        accessToken,
        refreshToken,
        expiresIn,
    };
};
exports.generateTokens = generateTokens;
/**
 * Verify JWT token and return payload
 */
const verifyToken = (token) => {
    try {
        const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_dev';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
/**
 * Extract token from authorization header
 */
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.split(' ')[1];
};
exports.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=authService.js.map