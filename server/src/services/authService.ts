import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types for token payloads
interface TokenPayload {
  userId: string;
  role: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Generate JWT tokens for authentication
 */
export const generateTokens = (user: { id: string; role: string }): TokenResponse => {
  // Get JWT configuration from environment variables
  const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_dev';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  // Calculate expiration time in seconds
  const expiresIn = typeof jwtExpiresIn === 'string' && jwtExpiresIn.endsWith('d')
    ? parseInt(jwtExpiresIn.slice(0, -1)) * 24 * 60 * 60
    : 24 * 60 * 60; // Default to 1 day in seconds

  // Create token payload
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
  };

  // JWT sign options
  const signOptions: SignOptions = {
    expiresIn: expiresIn as number,
  };

  const refreshSignOptions: SignOptions = {
    expiresIn: typeof refreshExpiresIn === 'string' && refreshExpiresIn.endsWith('d')
      ? parseInt(refreshExpiresIn.slice(0, -1)) * 24 * 60 * 60
      : 7 * 24 * 60 * 60, // Default to 7 days in seconds
  };

  // Generate access token
  const accessToken = jwt.sign(
    payload, 
    jwtSecret,
    signOptions
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    payload, 
    jwtSecret,
    refreshSignOptions
  );

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
};

/**
 * Verify JWT token and return payload
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_dev';
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from authorization header
 */
export const extractTokenFromHeader = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};
