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
export declare const generateTokens: (user: {
    id: string;
    role: string;
}) => TokenResponse;
/**
 * Verify JWT token and return payload
 */
export declare const verifyToken: (token: string) => TokenPayload | null;
/**
 * Extract token from authorization header
 */
export declare const extractTokenFromHeader: (authHeader: string) => string | null;
export {};
