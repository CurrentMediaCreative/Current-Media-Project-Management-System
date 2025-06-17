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
    picture?: string;
}) => Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string;
        name: any;
        email: string;
        role: any;
        picture: any;
    };
}>;
