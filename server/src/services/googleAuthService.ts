import { OAuth2Client } from 'google-auth-library';
import { storage } from './storageService';
import authService from './authService';
import { User } from '../types/user';
import { ApiError } from '../utils';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const USERS_FILE = 'users.json';

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
      throw new ApiError(401, 'Invalid Google token payload');
    }

    return payload;
  } catch (error) {
    console.error('Google token verification error:', error);
    throw new ApiError(401, 'Failed to verify Google token');
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
}) => {
  try {
    const users = await storage.read<User[]>(USERS_FILE);

    // Check if user already exists with this Google ID
    let user = users.find(u => u.googleId === googleData.googleId);

    // If not found by Google ID, try to find by email
    if (!user) {
      user = users.find(u => u.email === googleData.email);

      if (user) {
        // If user exists with this email but no Google ID, link the accounts
        user.googleId = googleData.googleId;
        user.updatedAt = new Date().toISOString();
        await storage.write(USERS_FILE, users);
      } else {
        // Create a new user with Google data
        user = await authService.createUser({
          name: googleData.name,
          email: googleData.email,
          googleId: googleData.googleId,
          role: 'user' // Default role for new users
        });
      }
    }

    // Login with Google ID
    const authResponse = await authService.login({ 
      email: user.email,
      googleId: googleData.googleId
    });

    return {
      user: authResponse.user,
      token: authResponse.token
    };
  } catch (error) {
    console.error('Google authentication error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to authenticate with Google');
  }
};
