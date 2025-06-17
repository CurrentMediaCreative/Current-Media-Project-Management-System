"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateGoogleUser = exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const client_1 = require("@prisma/client");
const authService_1 = require("./authService");
const prisma = new client_1.PrismaClient();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
/**
 * Verify Google ID token
 * @param token Google ID token
 * @returns User payload from Google
 */
const verifyGoogleToken = async (token) => {
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
    }
    catch (error) {
        console.error('Google token verification error:', error);
        throw new Error('Failed to verify Google token');
    }
};
exports.verifyGoogleToken = verifyGoogleToken;
/**
 * Find or create a user with Google credentials
 * @param googleData Google user data
 * @returns User object and authentication tokens
 */
const findOrCreateGoogleUser = async (googleData) => {
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
            }
            else {
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
        const tokens = (0, authService_1.generateTokens)(user);
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
    }
    catch (error) {
        console.error('Google authentication error:', error);
        throw new Error('Failed to authenticate with Google');
    }
};
exports.findOrCreateGoogleUser = findOrCreateGoogleUser;
//# sourceMappingURL=googleAuthService.js.map