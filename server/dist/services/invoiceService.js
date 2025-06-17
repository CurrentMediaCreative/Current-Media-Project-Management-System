"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const emailService_1 = __importDefault(require("./emailService"));
const prisma = new client_1.PrismaClient();
// Helper function to calculate invoice totals
function calculateTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const hst = subtotal * 0.13;
    const total = subtotal + hst;
    return { subtotal, hst, total };
}
class InvoiceService {
    /**
     * Create a new invoice
     */
    async createInvoice(data, userId) {
        const { items, contractor, ...rest } = data;
        const { subtotal, hst, total } = calculateTotals(items);
        // Generate invoice number
        const currentYear = new Date().getFullYear();
        const prefix = data.type === client_1.InvoiceType.CLIENT ? 'INV' : 'CONT';
        const lastInvoice = await prisma.invoice.findFirst({
            where: { number: { startsWith: `${prefix}-${currentYear}` } },
            orderBy: { number: 'desc' },
        });
        const nextNumber = lastInvoice
            ? parseInt(lastInvoice.number.split('-')[2]) + 1
            : 1;
        const number = `${prefix}-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
        const createData = {
            ...rest,
            number,
            items: items,
            contractor: contractor,
            status: client_1.InvoiceStatus.PENDING,
            emailSent: false,
            remindersSent: 0,
            subtotal,
            hst,
            total,
            createdBy: userId,
            project: {
                connect: { id: data.projectId }
            }
        };
        return prisma.invoice.create({
            data: createData,
            include: {
                project: true,
            },
        });
    }
    /**
     * Get invoice by ID
     */
    async getInvoiceById(id) {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                project: true,
            },
        });
        if (!invoice) {
            throw new utils_1.ApiError(404, `Invoice not found: ${id}`);
        }
        return invoice;
    }
    /**
     * Get invoices for a project
     */
    async getProjectInvoices(projectId) {
        return prisma.invoice.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            include: {
                project: true,
            },
        });
    }
    /**
     * Get all pending contractor invoices
     */
    async getPendingContractorInvoices() {
        return prisma.invoice.findMany({
            where: {
                type: client_1.InvoiceType.CONTRACTOR,
                status: {
                    in: [client_1.InvoiceStatus.PENDING, client_1.InvoiceStatus.RECEIVED],
                },
            },
            orderBy: { dueDate: 'asc' },
            include: {
                project: true,
            },
        });
    }
    /**
     * Get all unpaid client invoices
     */
    async getUnpaidClientInvoices() {
        return prisma.invoice.findMany({
            where: {
                type: client_1.InvoiceType.CLIENT,
                status: {
                    in: [client_1.InvoiceStatus.PENDING, client_1.InvoiceStatus.SENT, client_1.InvoiceStatus.OVERDUE],
                },
            },
            orderBy: { dueDate: 'asc' },
            include: {
                project: true,
            },
        });
    }
    /**
     * Update invoice status
     */
    async updateInvoiceStatus(id, status) {
        const updateData = {
            status,
            ...(status === client_1.InvoiceStatus.PAID && { paidDate: new Date() }),
        };
        return prisma.invoice.update({
            where: { id },
            data: updateData,
            include: {
                project: true,
            },
        });
    }
    /**
     * Mark invoice as sent
     */
    async markInvoiceAsSent(id) {
        const invoice = await this.getInvoiceById(id);
        if (invoice.type !== client_1.InvoiceType.CLIENT) {
            throw new utils_1.ApiError(400, 'Can only mark client invoices as sent');
        }
        return prisma.invoice.update({
            where: { id },
            data: {
                status: client_1.InvoiceStatus.SENT,
                emailSent: true,
                emailSentDate: new Date(),
            },
            include: {
                project: true,
            },
        });
    }
    /**
     * Mark contractor invoice as received
     */
    async markInvoiceAsReceived(id) {
        const invoice = await this.getInvoiceById(id);
        if (invoice.type !== client_1.InvoiceType.CONTRACTOR) {
            throw new utils_1.ApiError(400, 'Can only mark contractor invoices as received');
        }
        return prisma.invoice.update({
            where: { id },
            data: {
                status: client_1.InvoiceStatus.RECEIVED,
            },
            include: {
                project: true,
            },
        });
    }
    /**
     * Send payment reminder for an invoice
     */
    async sendPaymentReminder(id) {
        const invoice = await this.getInvoiceById(id);
        if (invoice.status === client_1.InvoiceStatus.PAID || invoice.status === client_1.InvoiceStatus.VOID) {
            throw new utils_1.ApiError(400, 'Cannot send reminder for paid or void invoices');
        }
        // Get email from project based on invoice type
        const emailRecipient = invoice.type === client_1.InvoiceType.CLIENT
            ? invoice.project.client
            : invoice.contractor?.role;
        if (!emailRecipient) {
            throw new utils_1.ApiError(400, 'No email recipient found for invoice');
        }
        // Send reminder email
        await emailService_1.default.sendInvoiceReminder(invoice.number, invoice.dueDate, invoice.total, emailRecipient);
        return prisma.invoice.update({
            where: { id },
            data: {
                remindersSent: { increment: 1 },
                lastReminderDate: new Date(),
            },
            include: {
                project: true,
            },
        });
    }
    /**
     * Check for overdue invoices and send reminders
     */
    async checkOverdueInvoices() {
        const overdueInvoices = await prisma.invoice.findMany({
            where: {
                status: {
                    in: [client_1.InvoiceStatus.SENT, client_1.InvoiceStatus.RECEIVED],
                },
                dueDate: {
                    lt: new Date(),
                },
            },
            include: {
                project: true,
            },
        });
        for (const invoice of overdueInvoices) {
            await prisma.invoice.update({
                where: { id: invoice.id },
                data: { status: client_1.InvoiceStatus.OVERDUE },
                include: {
                    project: true,
                },
            });
            // Send overdue notification if no reminder sent in last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            if (!invoice.lastReminderDate || invoice.lastReminderDate < sevenDaysAgo) {
                await this.sendPaymentReminder(invoice.id);
            }
        }
    }
    /**
     * Add attachment to invoice
     */
    async addAttachment(id, attachmentPath) {
        return prisma.invoice.update({
            where: { id },
            data: {
                attachments: {
                    push: attachmentPath,
                },
            },
            include: {
                project: true,
            },
        });
    }
}
exports.default = new InvoiceService();
//# sourceMappingURL=invoiceService.js.map