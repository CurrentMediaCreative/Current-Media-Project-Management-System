"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const Project_1 = __importDefault(require("../../models/Project"));
const User_1 = __importDefault(require("../../models/User"));
const types_1 = require("@shared/types");
const emailService_1 = require("../../services/emailService");
/**
 * Create a new project
 * @route POST /api/projects
 */
const createProject = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { name, client, budget, scope, deliverables, timeframe } = req.body;
        // Create new project
        const project = new Project_1.default({
            name,
            client,
            budget,
            scope,
            deliverables,
            timeframe,
            status: types_1.ProjectStatus.PENDING,
            createdBy: req.user.userId,
        });
        // Save project to database
        const savedProject = await project.save();
        // Get user name for email
        const user = await User_1.default.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send email notification to Jake
        const emailSent = await (0, emailService_1.sendProjectFormEmail)(savedProject, user.name);
        return res.status(201).json({
            success: true,
            data: savedProject,
            message: 'Project created successfully',
            emailSent,
        });
    }
    catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating project',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
    }
};
exports.createProject = createProject;
/**
 * Get all projects
 * @route GET /api/projects
 */
const getProjects = async (req, res) => {
    try {
        const projects = await Project_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: projects,
        });
    }
    catch (error) {
        console.error('Error getting projects:', error);
        return res.status(500).json({
            success: false,
            message: 'Error getting projects',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
    }
};
exports.getProjects = getProjects;
/**
 * Get project by ID
 * @route GET /api/projects/:id
 */
const getProjectById = async (req, res) => {
    try {
        const project = await Project_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error('Error getting project:', error);
        return res.status(500).json({
            success: false,
            message: 'Error getting project',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
    }
};
exports.getProjectById = getProjectById;
/**
 * Update project
 * @route PUT /api/projects/:id
 */
const updateProject = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { name, client, budget, scope, deliverables, timeframe, status } = req.body;
        // Find project
        const project = await Project_1.default.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }
        // Update project fields
        if (name)
            project.name = name;
        if (client)
            project.client = client;
        if (budget !== undefined)
            project.budget = budget;
        if (scope)
            project.scope = scope;
        if (deliverables)
            project.deliverables = deliverables;
        if (timeframe) {
            if (timeframe.startDate)
                project.timeframe.startDate = timeframe.startDate;
            if (timeframe.endDate)
                project.timeframe.endDate = timeframe.endDate;
        }
        if (status && Object.values(types_1.ProjectStatus).includes(status)) {
            project.status = status;
        }
        // Save updated project
        const updatedProject = await project.save();
        return res.status(200).json({
            success: true,
            data: updatedProject,
            message: 'Project updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating project',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
    }
};
exports.updateProject = updateProject;
/**
 * Delete project
 * @route DELETE /api/projects/:id
 */
const deleteProject = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Find and delete project
        const project = await Project_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting project',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
    }
};
exports.deleteProject = deleteProject;
//# sourceMappingURL=projectController.js.map