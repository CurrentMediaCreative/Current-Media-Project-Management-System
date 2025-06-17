"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("./projectController");
const projectValidation_1 = require("./projectValidation");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const types_1 = require("@shared/types");
const router = express_1.default.Router();
// Create a new project
router.post('/', authMiddleware_1.authenticate, projectValidation_1.validateCreateProject, projectController_1.createProject);
// Get all projects
router.get('/', authMiddleware_1.authenticate, projectController_1.getProjects);
// Get project by ID
router.get('/:id', authMiddleware_1.authenticate, projectValidation_1.validateProjectId, projectController_1.getProjectById);
// Update project
router.put('/:id', authMiddleware_1.authenticate, projectValidation_1.validateUpdateProject, projectController_1.updateProject);
// Delete project (admin only)
router.delete('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN]), projectValidation_1.validateProjectId, projectController_1.deleteProject);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map