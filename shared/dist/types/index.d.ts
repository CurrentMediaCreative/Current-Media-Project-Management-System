export declare enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    VIEWER = "VIEWER"
}
export declare enum ProjectStatus {
    NEW = "new",
    PENDING = "pending",
    ACTIVE = "active",
    COMPLETED = "completed",
    ARCHIVED = "archived"
}
export declare enum ClickUpStatus {
    NOT_SENT = "not_sent",
    PENDING = "pending",
    SYNCED = "synced",
    ERROR = "error"
}
export declare enum InvoiceType {
    CLIENT = "CLIENT",
    CONTRACTOR = "CONTRACTOR"
}
export declare enum InvoiceStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    RECEIVED = "RECEIVED",
    PAID = "PAID",
    OVERDUE = "OVERDUE",
    VOID = "VOID"
}
export declare enum ContractorRole {
    PRODUCER = "PRODUCER",
    STORY_BOARD_ARTIST = "STORY_BOARD_ARTIST",
    SHOOTER = "SHOOTER",
    JUNIOR_SHOOTER = "JUNIOR_SHOOTER",
    SOUND_CAPTURE = "SOUND_CAPTURE",
    SOUND_ENGINEER = "SOUND_ENGINEER",
    DRONE_OPERATOR = "DRONE_OPERATOR",
    ON_SITE_PRODUCER = "ON_SITE_PRODUCER",
    ALL_IN_ONE = "ALL_IN_ONE",
    PHOTOGRAPHER = "PHOTOGRAPHER",
    JUNIOR_EDITOR = "JUNIOR_EDITOR",
    SENIOR_EDITOR = "SENIOR_EDITOR",
    SFX_ARTIST = "SFX_ARTIST",
    GRAPHIC_ARTIST = "GRAPHIC_ARTIST",
    CONTRACTED_SHOOTER = "CONTRACTED_SHOOTER",
    GEAR_RENTAL = "GEAR_RENTAL",
    MILEAGE = "MILEAGE"
}
export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    googleId?: string;
    picture?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProjectContractor {
    role: ContractorRole;
    name: string;
    rate: number;
    hours?: number;
    days?: number;
}
export interface ProjectCosts {
    labor: number;
    equipment: number;
    travel: number;
    other: number;
    total: number;
}
export interface Project {
    id: string;
    name: string;
    client: string;
    producer: string;
    budget: number;
    scope: string;
    timeframe: {
        startDate: Date;
        endDate: Date;
    };
    status: ProjectStatus;
    clickUpStatus: ClickUpStatus;
    contractors: ProjectContractor[];
    estimatedCosts: ProjectCosts;
    actualCosts: ProjectCosts;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ContractorRate {
    id: string;
    role: ContractorRole;
    baseRate: number;
    chargeOutRate: number;
    isFixed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}
export interface InvoiceContractor {
    role: ContractorRole;
    hours?: number;
    days?: number;
    rate: number;
}
export interface Invoice {
    id: string;
    projectId: string;
    type: InvoiceType;
    number: string;
    status: InvoiceStatus;
    issueDate: Date;
    dueDate: Date;
    paidDate?: Date;
    contractor?: InvoiceContractor;
    items: InvoiceItem[];
    subtotal: number;
    hst: number;
    total: number;
    emailSent: boolean;
    emailSentDate?: Date;
    remindersSent: number;
    lastReminderDate?: Date;
    attachments: string[];
    notes?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthResponse {
    user: User;
    token: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface ApiError {
    message: string;
    code?: string;
    details?: Record<string, any>;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface ProjectFilters {
    status?: ProjectStatus;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    minBudget?: number;
    maxBudget?: number;
}
export interface ProjectSortOptions {
    field: 'name' | 'client' | 'budget' | 'startDate' | 'endDate' | 'status';
    direction: 'asc' | 'desc';
}
export interface ProjectFormData {
    name: string;
    client: string;
    producer: string;
    budget: number;
    scope: string;
    timeframe: {
        startDate: Date | null;
        endDate: Date | null;
    };
    contractors: ProjectContractor[];
    estimatedCosts: ProjectCosts;
}
export interface InvoiceFormData {
    type: InvoiceType;
    projectId: string;
    issueDate: Date;
    dueDate: Date;
    contractor?: InvoiceContractor;
    items: InvoiceItem[];
    notes?: string;
    attachments?: string[];
}
//# sourceMappingURL=index.d.ts.map