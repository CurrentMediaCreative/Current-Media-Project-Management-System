"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
class ValidationError extends ApiError {
    constructor(message, errors) {
        super(400, message);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends ApiError {
    constructor(message) {
        super(401, message);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends ApiError {
    constructor(message) {
        super(403, message);
        this.name = 'AuthorizationError';
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends ApiError {
    constructor(message) {
        super(404, message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=errors.js.map