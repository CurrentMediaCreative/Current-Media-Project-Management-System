import { ProjectContractor } from '../models/Project';
export declare const EmailService: {
    /**
     * Send contractor assignment email
     */
    sendContractorAssignment: (projectName: string, contractor: ProjectContractor, contactEmail: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    /**
     * Send invoice reminder email
     */
    sendInvoiceReminder: (invoiceNumber: string, dueDate: Date, amount: number, recipientEmail: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    /**
     * Send invoice to client
     */
    sendInvoice: (invoiceNumber: string, clientEmail: string, amount: number, dueDate: Date, attachments: any[]) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    /**
     * Send project status update
     */
    sendProjectUpdate: (projectName: string, status: string, recipientEmail: string, details: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
};
export default EmailService;
