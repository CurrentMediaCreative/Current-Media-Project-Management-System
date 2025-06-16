// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  PROJECTS: {
    BASE: '/api/projects',
    BY_ID: (id: string) => `/api/projects/${id}`,
    BUDGET: (id: string) => `/api/projects/${id}/budget`,
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
  },
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    BY_ID: (id: string) => `/api/notifications/${id}`,
    MARK_READ: '/api/notifications/mark-read',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'current_media_auth_token',
  USER: 'current_media_user',
  THEME: 'current_media_theme',
};

// Budget Categories
export const BUDGET_CATEGORIES = [
  'Pre-Production',
  'Production',
  'Post-Production',
  'Equipment',
  'Talent',
  'Location',
  'Travel',
  'Accommodation',
  'Catering',
  'Miscellaneous',
];

// Project Statuses with Display Names and Colors
export const PROJECT_STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: '#9e9e9e', // Grey
  },
  pending: {
    label: 'Pending',
    color: '#ff9800', // Orange
  },
  in_progress: {
    label: 'In Progress',
    color: '#2196f3', // Blue
  },
  completed: {
    label: 'Completed',
    color: '#4caf50', // Green
  },
  archived: {
    label: 'Archived',
    color: '#607d8b', // Blue Grey
  },
};

// Notification Types with Display Names and Colors
export const NOTIFICATION_TYPE_CONFIG = {
  reminder: {
    label: 'Reminder',
    color: '#ff9800', // Orange
  },
  update: {
    label: 'Update',
    color: '#2196f3', // Blue
  },
  alert: {
    label: 'Alert',
    color: '#f44336', // Red
  },
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
  POSITIVE_NUMBER: 'Please enter a positive number',
  DATE_RANGE: 'End date must be after start date',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  TIMESTAMP: 'YYYY-MM-DD HH:mm:ss',
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  OPTIONS: [5, 10, 25, 50, 100],
};
