import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import { generateTokens } from './authService';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID token
 * @param token Google ID token
 * @returns User payload from Google
 */
export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }

    return payload;
  } catch (error) {
    console.error('Google token verification error:', error);
    throw new Error('Failed to verify Google token');
  }
};

/**
 * Find or create a user with Google credentials
 * @param googleData Google user data
 * @returns User object and authentication tokens
 */
export const findOrCreateGoogleUser = async (googleData: {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}) => {
  try {
    // Check if user already exists with this Google ID
    let user = await prisma.user.findUnique({
      where: { googleId: googleData.googleId },
    });

    // If not found by Google ID, try to find by email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: googleData.email },
      });

      if (user) {
        // If user exists with this email but no Google ID, link the accounts
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleData.googleId,
            picture: googleData.picture || user.picture,
          },
        });
      } else {
        // Create a new user with Google data
        user = await prisma.user.create({
          data: {
            name: googleData.name,
            email: googleData.email,
            googleId: googleData.googleId,
            picture: googleData.picture,
            role: 'VIEWER', // Default role for new users
          },
        });
      }
    }

    // Generate authentication tokens
    const tokens = generateTokens(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
      ...tokens,
    };
  } catch (error) {
    console.error('Google authentication error:', error);
    throw new Error('Failed to authenticate with Google');
  }
};
