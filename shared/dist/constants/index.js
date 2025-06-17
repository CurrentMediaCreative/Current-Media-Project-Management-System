"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGINATION = exports.DATE_FORMATS = exports.VALIDATION_MESSAGES = exports.NOTIFICATION_TYPE_CONFIG = exports.PROJECT_STATUS_CONFIG = exports.BUDGET_CATEGORIES = exports.STORAGE_KEYS = exports.API_ENDPOINTS = void 0;
// API Endpoints
exports.API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
    },
    PROJECTS: {
        BASE: '/api/projects',
        BY_ID: (id) => `/api/projects/${id}`,
        BUDGET: (id) => `/api/projects/${id}/budget`,
    },
    USERS: {
        BASE: '/api/users',
        BY_ID: (id) => `/api/users/${id}`,
    },
    NOTIFICATIONS: {
        BASE: '/api/notifications',
        BY_ID: (id) => `/api/notifications/${id}`,
        MARK_READ: '/api/notifications/mark-read',
    },
};
// Local Storage Keys
exports.STORAGE_KEYS = {
    AUTH_TOKEN: 'current_media_auth_token',
    USER: 'current_media_user',
    THEME: 'current_media_theme',
};
// Budget Categories
exports.BUDGET_CATEGORIES = [
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
exports.PROJECT_STATUS_CONFIG = {
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
exports.NOTIFICATION_TYPE_CONFIG = {
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
exports.VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required',
    EMAIL: 'Please enter a valid email address',
    MIN_LENGTH: (min) => `Must be at least ${min} characters`,
    MAX_LENGTH: (max) => `Must be at most ${max} characters`,
    POSITIVE_NUMBER: 'Please enter a positive number',
    DATE_RANGE: 'End date must be after start date',
};
// Date Formats
exports.DATE_FORMATS = {
    DISPLAY: 'MMM DD, YYYY',
    INPUT: 'YYYY-MM-DD',
    TIMESTAMP: 'YYYY-MM-DD HH:mm:ss',
};
// Pagination Defaults
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    OPTIONS: [5, 10, 25, 50, 100],
};
//# sourceMappingURL=index.js.map