import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { generateTokens } from '../../services/authService';
import { verifyGoogleToken, findOrCreateGoogleUser } from '../../services/googleAuthService';
import { UserRole } from '@shared/types';

const prisma = new PrismaClient();

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
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
        role: role || UserRole.VIEWER, // Default to VIEWER role
      },
    });

    // Generate tokens
    const tokens = generateTokens(user);

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
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Error registering user',
      error: error.message,
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
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
    const tokens = generateTokens(user);

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
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error during login',
      error: error.message,
    });
  }
};

/**
 * Refresh access token
 * @route POST /api/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const payload = await import('../../services/authService').then(
      (module) => module.verifyToken(refreshToken)
    );

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
    const tokens = generateTokens(user);

    // Return new tokens
    res.status(200).json({
      message: 'Token refreshed successfully',
      ...tokens,
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      message: 'Error refreshing token',
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

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
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Error retrieving user profile',
      error: error.message,
    });
  }
};

/**
 * Logout user (client-side only)
 * @route POST /api/auth/logout
 */
export const logout = (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout successful' });
};

/**
 * Google login/signup
 * @route POST /api/auth/google
 */
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify the Google token
    const googlePayload = await verifyGoogleToken(token);
    
    if (!googlePayload.email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Find or create user with Google data
    const result = await findOrCreateGoogleUser({
      googleId: googlePayload.sub,
      email: googlePayload.email,
      name: googlePayload.name || googlePayload.email.split('@')[0],
      picture: googlePayload.picture,
    });

    // Return user info and tokens
    res.status(200).json({
      message: 'Google login successful',
      ...result,
    });
  } catch (error: any) {
    console.error('Google login error:', error);
    res.status(500).json({
      message: 'Error during Google login',
      error: error.message,
    });
  }
};
