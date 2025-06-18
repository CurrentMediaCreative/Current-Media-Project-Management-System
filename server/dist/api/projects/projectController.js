"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const client_1 = require("@prisma/client");
const emailService_1 = require("../../services/emailService");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const prisma = new client_1.PrismaClient();
const emailService = new emailService_1.EmailService();
/**
 * Create a new project
 * @route POST /api/projects
 */
exports.createProject = (0, authMiddleware_1.asyncHandler)(async (req, res) => {
    const { title, client, budget, startDate, endDate } = req.body;
    const projectData = {
        title,
        client,
        status: client_1.ProjectStatus.NEW_NOT_SENT,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: parseFloat(budget)
    };
    // Create new project
    const savedProject = await prisma.project.create({
        data: projectData
    });
    // Get user name for email
    const user = await prisma.user.findUnique({
        where: { id: req.user.userId }
    });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Send email notification to Jake
    await emailService.sendProjectToJake({
        to: process.env.JAKE_EMAIL || 'jake@currentmedia.ca',
        projectData: {
            title: savedProject.title,
            client: savedProject.client,
            startDate: savedProject.startDate,
            endDate: savedProject.endDate,
            budget: savedProject.budget
        }
    });
    return res.status(201).json({
        success: true,
        data: savedProject,
        message: 'Project created successfully'
    });
});
/**
 * Get all projects
 * @route GET /api/projects
 */
exports.getProjects = (0, authMiddleware_1.asyncHandler)(async (_req, res) => {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({
        success: true,
        data: projects,
    });
});
/**
 * Get project by ID
 * @route GET /api/projects/:id
 */
exports.getProjectById = (0, authMiddleware_1.asyncHandler)(async (req, res) => {
    const project = await prisma.project.findUnique({
        where: { id: req.params.id }
    });
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }
    return res.status(200).json({
        success: true,
        data: project,
    });
});
/**
 * Update project
 * @route PUT /api/projects/:id
 */
exports.updateProject = (0, authMiddleware_1.asyncHandler)(async (req, res) => {
    const { title, client, budget, startDate, endDate, status, clickupId } = req.body;
    const updateData = {};
    if (title)
        updateData.title = title;
    if (client)
        updateData.client = client;
    if (budget)
        updateData.budget = parseFloat(budget);
    if (startDate)
        updateData.startDate = new Date(startDate);
    if (endDate)
        updateData.endDate = new Date(endDate);
    if (status)
        updateData.status = status;
    if (clickupId)
        updateData.clickupId = clickupId;
    const updatedProject = await prisma.project.update({
        where: { id: req.params.id },
        data: updateData
    });
    return res.status(200).json({
        success: true,
        data: updatedProject,
        message: 'Project updated successfully',
    });
});
/**
 * Delete project
 * @route DELETE /api/projects/:id
 */
exports.deleteProject = (0, authMiddleware_1.asyncHandler)(async (req, res) => {
    const project = await prisma.project.delete({
        where: { id: req.params.id }
    });
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
    });
});
//# sourceMappingURL=projectController.js.map