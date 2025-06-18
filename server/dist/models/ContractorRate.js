"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorRateModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.ContractorRateModel = {
    async create(data) {
        return prisma.contractorRate.create({
            data: {
                role: data.role,
                baseRate: data.baseRate,
                chargeOutRate: data.chargeOutRate ?? data.baseRate * 1.5,
                isFixed: data.isFixed ?? false
            }
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
        const updateData = {};
        if (data.role) {
            updateData.role = data.role;
        }
        if (typeof data.baseRate === 'number') {
            updateData.baseRate = data.baseRate;
            // Update chargeOutRate if not fixed and not explicitly provided
            if (!data.isFixed && typeof data.chargeOutRate !== 'number') {
                updateData.chargeOutRate = data.baseRate * 1.5;
            }
        }
        if (typeof data.chargeOutRate === 'number') {
            updateData.chargeOutRate = data.chargeOutRate;
        }
        if (typeof data.isFixed === 'boolean') {
            updateData.isFixed = data.isFixed;
        }
        return prisma.contractorRate.update({
            where: { id },
            data: updateData
        });
    },
    async updateRate(role, baseRate, chargeOutRate) {
        return prisma.contractorRate.update({
            where: { role },
            data: {
                baseRate,
                chargeOutRate: chargeOutRate ?? baseRate * 1.5
            }
        });
    },
    async delete(id) {
        await prisma.contractorRate.delete({
            where: { id }
        });
    }
};
//# sourceMappingURL=ContractorRate.js.map