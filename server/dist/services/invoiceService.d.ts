import { InvoiceType, InvoiceStatus, Prisma } from '@prisma/client';
interface InvoiceFormData {
    projectId: string;
    type: InvoiceType;
    issueDate: Date;
    dueDate: Date;
    items: {
        description: string;
        quantity: number;
        rate: number;
        amount: number;
    }[];
    contractor?: {
        role: string;
        hours?: number;
        days?: number;
        rate: number;
    };
    notes?: string;
}
declare class InvoiceService {
    /**
     * Create a new invoice
     */
    createInvoice(data: InvoiceFormData, userId: string): Promise<{
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            client: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            timeframe: Prisma.JsonValue;
            budget: Prisma.JsonValue;
            contractors: Prisma.JsonValue[];
        };
    } & {
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    }>;
    /**
     * Get invoice by ID
     */
    getInvoiceById(id: string): Promise<{
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            client: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            timeframe: Prisma.JsonValue;
            budget: Prisma.JsonValue;
            contractors: Prisma.JsonValue[];
        };
    } & {
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    }>;
    /**
     * Get invoices for a project
     */
    getProjectInvoices(projectId: string): Promise<({
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            client: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            timeframe: Prisma.JsonValue;
            budget: Prisma.JsonValue;
            contractors: Prisma.JsonValue[];
        };
    } & {
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    })[]>;
    /**
     * Get all pending contractor invoices
     */
    getPendingContractorInvoices(): Promise<{
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    }[]>;
    /**
     * Get all unpaid client invoices
     */
    getUnpaidClientInvoices(): Promise<{
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    }[]>;
    /**
     * Update invoice status
     */
    updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<{
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            client: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            timeframe: Prisma.JsonValue;
            budget: Prisma.JsonValue;
            contractors: Prisma.JsonValue[];
        };
    } & {
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    }>;
    /**
     * Mark invoice as sent
     */
    markInvoiceAsSent(id: string): Promise<{
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    }>;
    /**
     * Mark contractor invoice as received
     */
    markInvoiceAsReceived(id: string): Promise<{
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            client: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            timeframe: Prisma.JsonValue;
            budget: Prisma.JsonValue;
            contractors: Prisma.JsonValue[];
        };
    } & {
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    }>;
    /**
     * Send payment reminder for an invoice
     */
    sendPaymentReminder(id: string): Promise<{
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    }>;
    /**
     * Check for overdue invoices and send reminders
     */
    checkOverdueInvoices(): Promise<void>;
    /**
     * Add attachment to invoice
     */
    addAttachment(id: string, attachmentPath: string): Promise<{
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        amount: number;
        paidDate: Date | null;
    }>;
}
declare const _default: InvoiceService;
export default _default;
