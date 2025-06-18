export declare class ApiError extends Error {
    statusCode: number;
    details?: any | undefined;
    constructor(statusCode: number, message: string, details?: any | undefined);
    static badRequest(message: string, details?: any): ApiError;
    static unauthorized(message?: string): ApiError;
    static forbidden(message?: string): ApiError;
    static notFound(message?: string): ApiError;
    static conflict(message: string, details?: any): ApiError;
    static internal(message?: string): ApiError;
}
