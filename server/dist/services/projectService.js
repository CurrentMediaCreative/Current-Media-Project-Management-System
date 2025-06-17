"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const contractorRateService_1 = __importDefault(require("./contractorRateService"));
const prisma = new client_1.PrismaClient();
class ProjectService {
    /**
     * Create a new project
     */
    async createProject(data) {
        // Validate timeframe
        if (data.timeframe.endDate < data.timeframe.startDate) {
            throw new utils_1.ApiError(400, 'End date must be after start date');
        }
        // Validate contractors if provided
        if (data.contractors) {
            for (const contractor of data.contractors) {
                // Validate rate for role
                await contractorRateService_1.default.validateRateForRole(contractor.role, contractor.rate);
            }
        }
        return Project_1.Project.create(data);
    }
    /**
     * Get project by ID
     */
    async getProjectById(id) {
        const project = await Project_1.Project.findById(id);
        if (!project) {
            throw new utils_1.ApiError(404, `Project not found: ${id}`);
        }
        return project;
    }
    /**
     * List projects with optional filtering
     */
    async listProjects(params = {}) {
        return Project_1.Project.list(params);
    }
    /**
     * Update project details
     */
    async updateProject(id, data) {
        // Validate project exists
        const project = await this.getProjectById(id);
        // Validate timeframe if updating
        if (data.timeframe) {
            if (data.timeframe.endDate < data.timeframe.startDate) {
                throw new utils_1.ApiError(400, 'End date must be after start date');
            }
        }
        // Validate contractors if updating
        if (data.contractors) {
            for (const contractor of data.contractors) {
                // Validate rate for role
                await contractorRateService_1.default.validateRateForRole(contractor.role, contractor.rate);
            }
        }
        return Project_1.Project.update(id, data);
    }
    /**
     * Update project costs
     */
    async updateProjectCosts(projectId, estimatedCosts, actualCosts) {
        // Validate project exists
        await this.getProjectById(projectId);
        // Validate contractor rates if updating
        if (estimatedCosts) {
            for (const contractor of estimatedCosts.contractors) {
                await contractorRateService_1.default.validateRateForRole(contractor.role, contractor.rate);
            }
        }
        if (actualCosts) {
            for (const contractor of actualCosts.contractors) {
                await contractorRateService_1.default.validateRateForRole(contractor.role, contractor.rate);
            }
        }
        return Project_1.Project.updateCosts(projectId, estimatedCosts, actualCosts);
    }
    /**
     * Update project status
     */
    async updateProjectStatus(id, status) {
        // Validate project exists
        await this.getProjectById(id);
        return Project_1.Project.update(id, { status });
    }
    /**
     * Update ClickUp sync status
     */
    async updateClickUpStatus(id, clickUpStatus) {
        // Validate project exists
        await this.getProjectById(id);
        return Project_1.Project.update(id, { clickUpStatus });
    }
    /**
     * Delete project
     */
    async deleteProject(id) {
        // Validate project exists
        await this.getProjectById(id);
        return Project_1.Project.delete(id);
    }
}
exports.default = new ProjectService();
//# sourceMappingURL=projectService.js.map