import { PrismaClient, Invoice as PrismaInvoice, InvoiceStatus, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export type Invoice = PrismaInvoice;

type CreateInvoiceInput = Prisma.InvoiceUncheckedCreateInput;
type UpdateInvoiceInput = Prisma.InvoiceUncheckedUpdateInput;

export const InvoiceModel = {
  async create(data: {
    projectId: string;
    amount: number;
    issueDate: Date;
    dueDate: Date;
  }): Promise<Invoice> {
    const createData: CreateInvoiceInput = {
      projectId: data.projectId,
      amount: data.amount,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      status: 'PENDING'
    };

    return prisma.invoice.create({
      data: createData
    });
  },

  async findById(id: string): Promise<Invoice | null> {
    return prisma.invoice.findUnique({
      where: { id }
    });
  },

  async findByProject(projectId: string): Promise<Invoice[]> {
    return prisma.invoice.findMany({
      where: { projectId },
      orderBy: { issueDate: 'desc' }
    });
  },

  async findByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    return prisma.invoice.findMany({
      where: { status },
      orderBy: { dueDate: 'asc' }
    });
  },

  async update(id: string, data: Partial<{
    amount: number;
    status: InvoiceStatus;
    issueDate: Date;
    dueDate: Date;
    paidDate: Date | null;
  }>): Promise<Invoice> {
    const updateData: UpdateInvoiceInput = data;
    return prisma.invoice.update({
      where: { id },
      data: updateData
    });
  },

  async updateStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const updateData: UpdateInvoiceInput = {
      status,
      ...(status === 'PAID' ? { paidDate: new Date() } : {})
    };

    return prisma.invoice.update({
      where: { id },
      data: updateData
    });
  },

  async findOverdue(): Promise<Invoice[]> {
    const today = new Date();
    return prisma.invoice.findMany({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: today
        }
      },
      orderBy: { dueDate: 'asc' }
    });
  }
};
