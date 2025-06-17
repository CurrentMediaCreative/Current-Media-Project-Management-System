import { PrismaClient, InvoiceType, InvoiceStatus, Prisma } from '@prisma/client';
import { ApiError } from '../utils';
import emailService from './emailService';

const prisma = new PrismaClient();

// Types
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

// Helper function to calculate invoice totals
function calculateTotals(items: InvoiceFormData['items']) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const hst = subtotal * 0.13;
  const total = subtotal + hst;
  return { subtotal, hst, total };
}

class InvoiceService {
  /**
   * Create a new invoice
   */
  async createInvoice(data: InvoiceFormData, userId: string) {
    const { items, contractor, ...rest } = data;
    const { subtotal, hst, total } = calculateTotals(items);

    // Generate invoice number
    const currentYear = new Date().getFullYear();
    const prefix = data.type === InvoiceType.CLIENT ? 'INV' : 'CONT';
    const lastInvoice = await prisma.invoice.findFirst({
      where: { number: { startsWith: `${prefix}-${currentYear}` } },
      orderBy: { number: 'desc' },
    });
    const nextNumber = lastInvoice 
      ? parseInt(lastInvoice.number.split('-')[2]) + 1 
      : 1;
    const number = `${prefix}-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;

    const createData: Prisma.InvoiceCreateInput = {
      ...rest,
      number,
      items: items as unknown as Prisma.InputJsonValue[],
      contractor: contractor as unknown as Prisma.InputJsonValue,
      status: InvoiceStatus.PENDING,
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
  async getInvoiceById(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!invoice) {
      throw new ApiError(404, `Invoice not found: ${id}`);
    }

    return invoice;
  }

  /**
   * Get invoices for a project
   */
  async getProjectInvoices(projectId: string) {
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
        type: InvoiceType.CONTRACTOR,
        status: {
          in: [InvoiceStatus.PENDING, InvoiceStatus.RECEIVED],
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
        type: InvoiceType.CLIENT,
        status: {
          in: [InvoiceStatus.PENDING, InvoiceStatus.SENT, InvoiceStatus.OVERDUE],
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
  async updateInvoiceStatus(id: string, status: InvoiceStatus) {
    const updateData: Prisma.InvoiceUpdateInput = {
      status,
      ...(status === InvoiceStatus.PAID && { paidDate: new Date() }),
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
  async markInvoiceAsSent(id: string) {
    const invoice = await this.getInvoiceById(id);

    if (invoice.type !== InvoiceType.CLIENT) {
      throw new ApiError(400, 'Can only mark client invoices as sent');
    }

    return prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.SENT,
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
  async markInvoiceAsReceived(id: string) {
    const invoice = await this.getInvoiceById(id);

    if (invoice.type !== InvoiceType.CONTRACTOR) {
      throw new ApiError(400, 'Can only mark contractor invoices as received');
    }

    return prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.RECEIVED,
      },
      include: {
        project: true,
      },
    });
  }

  /**
   * Send payment reminder for an invoice
   */
  async sendPaymentReminder(id: string) {
    const invoice = await this.getInvoiceById(id);

    if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.VOID) {
      throw new ApiError(400, 'Cannot send reminder for paid or void invoices');
    }

    // Get email from project based on invoice type
    const emailRecipient = invoice.type === InvoiceType.CLIENT 
      ? invoice.project.client 
      : (invoice.contractor as { role: string })?.role;

    if (!emailRecipient) {
      throw new ApiError(400, 'No email recipient found for invoice');
    }

    // Send reminder email
    await emailService.sendInvoiceReminder(
      invoice.number,
      invoice.dueDate,
      invoice.total,
      emailRecipient
    );

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
  async checkOverdueInvoices(): Promise<void> {
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: {
          in: [InvoiceStatus.SENT, InvoiceStatus.RECEIVED],
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
        data: { status: InvoiceStatus.OVERDUE },
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
  async addAttachment(id: string, attachmentPath: string) {
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

export default new InvoiceService();
