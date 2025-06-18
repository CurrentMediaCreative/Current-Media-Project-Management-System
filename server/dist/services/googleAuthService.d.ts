/**
 * Verify Google ID token
 * @param token Google ID token
 * @returns User payload from Google
 */
export declare const verifyGoogleToken: (token: string) => Promise<import("google-auth-library").TokenPayload>;
/**
 * Find or create a user with Google credentials
 * @param googleData Google user data
 * @returns User object and authentication tokens
 */
export declare const findOrCreateGoogleUser: (googleData: {
    googleId: string;
    email: string;
    name: string;
}) => Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}>;
