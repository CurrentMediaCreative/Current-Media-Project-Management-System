export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string>) {
    super(400, message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string) {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string) {
    super(403, message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}
