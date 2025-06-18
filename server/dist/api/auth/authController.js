"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.logout = exports.getProfile = exports.refreshToken = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const authService_1 = require("../../services/authService");
const googleAuthService_1 = require("../../services/googleAuthService");
const types_1 = require("@shared/types");
const prisma = new client_1.PrismaClient();
/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || types_1.UserRole.VIEWER, // Default to VIEWER role
            },
        });
        // Generate tokens
        const tokens = (0, authService_1.generateTokens)(user);
        // Return user info and tokens
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            ...tokens,
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message,
        });
    }
};
exports.register = register;
/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Generate tokens
        const tokens = (0, authService_1.generateTokens)(user);
        // Return user info and tokens
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            ...tokens,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Error during login',
            error: error.message,
        });
    }
};
exports.login = login;
/**
 * Refresh access token
 * @route POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        // Verify refresh token
        const payload = await Promise.resolve().then(() => __importStar(require('../../services/authService'))).then((module) => module.verifyToken(refreshToken));
        if (!payload) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
        // Find user
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        // Generate new tokens
        const tokens = (0, authService_1.generateTokens)(user);
        // Return new tokens
        res.status(200).json({
            message: 'Token refreshed successfully',
            ...tokens,
        });
    }
    catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            message: 'Error refreshing token',
            error: error.message,
        });
    }
};
exports.refreshToken = refreshToken;
/**
 * Get current user profile
 * @route GET /api/auth/me
 */
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            message: 'Error retrieving user profile',
            error: error.message,
        });
    }
};
exports.getProfile = getProfile;
/**
 * Logout user (client-side only)
 * @route POST /api/auth/logout
 */
const logout = (_req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};
exports.logout = logout;
/**
 * Google login/signup
 * @route POST /api/auth/google
 */
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        // Verify the Google token
        const googlePayload = await (0, googleAuthService_1.verifyGoogleToken)(token);
        if (!googlePayload.email) {
            return res.status(400).json({ message: 'Email not provided by Google' });
        }
        // Find or create user with Google data
        const result = await (0, googleAuthService_1.findOrCreateGoogleUser)({
            googleId: googlePayload.sub,
            email: googlePayload.email,
            name: googlePayload.name || googlePayload.email.split('@')[0],
        });
        // Return user info and tokens
        res.status(200).json({
            message: 'Google login successful',
            ...result,
        });
    }
    catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            message: 'Error during Google login',
            error: error.message,
        });
    }
};
exports.googleLogin = googleLogin;
//# sourceMappingURL=authController.js.map