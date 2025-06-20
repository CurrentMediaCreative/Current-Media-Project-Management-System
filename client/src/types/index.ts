export * from './project';
export * from './auth';
export * from './documents';
export * from './clickup';

// Common types used across the application
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
