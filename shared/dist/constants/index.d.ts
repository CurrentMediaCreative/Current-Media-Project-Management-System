export declare const API_ENDPOINTS: {
    AUTH: {
        LOGIN: string;
        REGISTER: string;
        LOGOUT: string;
        REFRESH: string;
    };
    PROJECTS: {
        BASE: string;
        BY_ID: (id: string) => string;
        BUDGET: (id: string) => string;
    };
    USERS: {
        BASE: string;
        BY_ID: (id: string) => string;
    };
    NOTIFICATIONS: {
        BASE: string;
        BY_ID: (id: string) => string;
        MARK_READ: string;
    };
};
export declare const STORAGE_KEYS: {
    AUTH_TOKEN: string;
    USER: string;
    THEME: string;
};
export declare const BUDGET_CATEGORIES: string[];
export declare const PROJECT_STATUS_CONFIG: {
    draft: {
        label: string;
        color: string;
    };
    pending: {
        label: string;
        color: string;
    };
    in_progress: {
        label: string;
        color: string;
    };
    completed: {
        label: string;
        color: string;
    };
    archived: {
        label: string;
        color: string;
    };
};
export declare const NOTIFICATION_TYPE_CONFIG: {
    reminder: {
        label: string;
        color: string;
    };
    update: {
        label: string;
        color: string;
    };
    alert: {
        label: string;
        color: string;
    };
};
export declare const VALIDATION_MESSAGES: {
    REQUIRED: string;
    EMAIL: string;
    MIN_LENGTH: (min: number) => string;
    MAX_LENGTH: (max: number) => string;
    POSITIVE_NUMBER: string;
    DATE_RANGE: string;
};
export declare const DATE_FORMATS: {
    DISPLAY: string;
    INPUT: string;
    TIMESTAMP: string;
};
export declare const PAGINATION: {
    DEFAULT_PAGE: number;
    DEFAULT_LIMIT: number;
    OPTIONS: number[];
};
//# sourceMappingURL=index.d.ts.map