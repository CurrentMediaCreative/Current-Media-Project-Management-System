import { InvoiceStatus } from '@prisma/client';
export interface Invoice {
    id: string;
    projectId: string;
    amount: number;
    status: InvoiceStatus;
    issueDate: Date;
    dueDate: Date;
    paidDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const InvoiceModel: {
    create(data: {
        projectId: string;
        amount: number;
        issueDate: Date;
        dueDate: Date;
    }): Promise<Invoice>;
    findById(id: string): Promise<Invoice | null>;
    findByProject(projectId: string): Promise<Invoice[]>;
    findByStatus(status: InvoiceStatus): Promise<Invoice[]>;
    update(id: string, data: Partial<{
        amount: number;
        status: InvoiceStatus;
        issueDate: Date;
        dueDate: Date;
        paidDate: Date | null;
    }>): Promise<Invoice>;
    updateStatus(id: string, status: InvoiceStatus): Promise<Invoice>;
    findOverdue(): Promise<Invoice[]>;
};
