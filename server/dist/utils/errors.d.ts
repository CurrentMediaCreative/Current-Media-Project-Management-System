export declare class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare class ValidationError extends ApiError {
    errors: Record<string, string>;
    constructor(message: string, errors: Record<string, string>);
}
export declare class AuthenticationError extends ApiError {
    constructor(message: string);
}
export declare class AuthorizationError extends ApiError {
    constructor(message: string);
}
export declare class NotFoundError extends ApiError {
    constructor(message: string);
}
