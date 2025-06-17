"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Type guards
function isTimeframe(json) {
    return typeof json === 'object'
        && typeof json.startDate === 'string'
        && typeof json.endDate === 'string';
}
function isBudget(json) {
    return typeof json === 'object'
        && typeof json.estimated === 'number'
        && typeof json.actual === 'number';
}
function isContractor(json) {
    return typeof json === 'object'
        && typeof json.name === 'string'
        && typeof json.email === 'string'
        && typeof json.role === 'string'
        && typeof json.rate === 'number';
}
// Serialization helpers
function serializeTimeframe(timeframe) {
    return {
        startDate: timeframe.startDate,
        endDate: timeframe.endDate
    };
}
function serializeBudget(budget) {
    return {
        estimated: budget.estimated,
        actual: budget.actual
    };
}
function serializeContractor(contractor) {
    return {
        name: contractor.name,
        email: contractor.email,
        role: contractor.role,
        rate: contractor.rate
    };
}
// Convert Prisma Project to our Project interface
function toDomainProject(prismaProject) {
    if (!isTimeframe(prismaProject.timeframe)) {
        throw new Error('Invalid timeframe data in project');
    }
    if (!isBudget(prismaProject.budget)) {
        throw new Error('Invalid budget data in project');
    }
    if (!Array.isArray(prismaProject.contractors) || !prismaProject.contractors.every(isContractor)) {
        throw new Error('Invalid contractors data in project');
    }
    return {
        ...prismaProject,
        timeframe: prismaProject.timeframe,
        budget: prismaProject.budget,
        contractors: prismaProject.contractors
    };
}
exports.ProjectModel = {
    async create(data) {
        const project = await prisma.project.create({
            data: {
                title: data.title,
                client: data.client,
                timeframe: serializeTimeframe(data.timeframe),
                budget: serializeBudget(data.budget),
                contractors: data.contractors.map(serializeContractor)
            }
        });
        return toDomainProject(project);
    },
    async findById(id) {
        const project = await prisma.project.findUnique({
            where: { id }
        });
        return project ? toDomainProject(project) : null;
    },
    async findAll() {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return projects.map(toDomainProject);
    },
    async update(id, data) {
        const updateData = { ...data };
        if (data.timeframe) {
            updateData.timeframe = serializeTimeframe(data.timeframe);
        }
        if (data.budget) {
            updateData.budget = serializeBudget(data.budget);
        }
        if (data.contractors) {
            updateData.contractors = data.contractors.map(serializeContractor);
        }
        const project = await prisma.project.update({
            where: { id },
            data: updateData
        });
        return toDomainProject(project);
    },
    async updateStatus(id, status) {
        const project = await prisma.project.update({
            where: { id },
            data: { status }
        });
        return toDomainProject(project);
    },
    async findByStatus(status) {
        const projects = await prisma.project.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' }
        });
        return projects.map(toDomainProject);
    }
};
//# sourceMappingURL=Project.js.map