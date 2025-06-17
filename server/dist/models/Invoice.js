"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.InvoiceModel = {
    async create(data) {
        const createData = {
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
    async findById(id) {
        return prisma.invoice.findUnique({
            where: { id }
        });
    },
    async findByProject(projectId) {
        return prisma.invoice.findMany({
            where: { projectId },
            orderBy: { issueDate: 'desc' }
        });
    },
    async findByStatus(status) {
        return prisma.invoice.findMany({
            where: { status },
            orderBy: { dueDate: 'asc' }
        });
    },
    async update(id, data) {
        const updateData = { ...data };
        return prisma.invoice.update({
            where: { id },
            data: updateData
        });
    },
    async updateStatus(id, status) {
        const updateData = {
            status,
            ...(status === 'PAID' ? { paidDate: new Date() } : {})
        };
        return prisma.invoice.update({
            where: { id },
            data: updateData
        });
    },
    async findOverdue() {
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
//# sourceMappingURL=Invoice.js.map