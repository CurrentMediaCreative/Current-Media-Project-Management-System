"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorRateModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.ContractorRateModel = {
    async create(data) {
        const createData = {
            role: data.role,
            rate: data.rate
        };
        return prisma.contractorRate.create({
            data: createData
        });
    },
    async findById(id) {
        return prisma.contractorRate.findUnique({
            where: { id }
        });
    },
    async findByRole(role) {
        return prisma.contractorRate.findUnique({
            where: { role }
        });
    },
    async findAll() {
        return prisma.contractorRate.findMany({
            orderBy: { role: 'asc' }
        });
    },
    async update(id, data) {
        const updateData = { ...data };
        return prisma.contractorRate.update({
            where: { id },
            data: updateData
        });
    },
    async updateRate(role, rate) {
        const updateData = { rate };
        return prisma.contractorRate.update({
            where: { role },
            data: updateData
        });
    },
    async delete(id) {
        await prisma.contractorRate.delete({
            where: { id }
        });
    }
};
//# sourceMappingURL=ContractorRate.js.map