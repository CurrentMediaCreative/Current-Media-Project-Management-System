"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
class ProjectService {
    /**
     * Create a new project
     */
    async createProject(input) {
        // Validate timeframe
        if (input.endDate < input.startDate) {
            throw new utils_1.ApiError(400, 'End date must be after start date');
        }
        return prisma.project.create({
            data: {
                ...input,
                status: client_1.ProjectStatus.NEW_NOT_SENT
            }
        });
    }
    /**
     * Get project by ID
     */
    async getProjectById(id) {
        const project = await prisma.project.findUnique({
            where: { id }
        });
        if (!project) {
            throw new utils_1.ApiError(404, `Project not found: ${id}`);
        }
        return project;
    }
    /**
     * List projects with optional filtering
     */
    async listProjects(params = {}) {
        const where = params.status ? { status: params.status } : {};
        return prisma.project.findMany({
            skip: params.skip,
            take: params.take,
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Update project details
     */
    async updateProject(id, input) {
        // Validate project exists
        await this.getProjectById(id);
        // Validate timeframe if updating both dates
        if (input.startDate && input.endDate) {
            if (input.endDate < input.startDate) {
                throw new utils_1.ApiError(400, 'End date must be after start date');
            }
        }
        return prisma.project.update({
            where: { id },
            data: {
                ...input
            }
        });
    }
    /**
     * Update project status
     */
    async updateProjectStatus(id, status) {
        // Validate project exists
        await this.getProjectById(id);
        return prisma.project.update({
            where: { id },
            data: { status }
        });
    }
    /**
     * Delete project
     */
    async deleteProject(id) {
        // Validate project exists
        await this.getProjectById(id);
        return prisma.project.delete({
            where: { id }
        });
    }
}
exports.default = new ProjectService();
//# sourceMappingURL=projectService.js.map