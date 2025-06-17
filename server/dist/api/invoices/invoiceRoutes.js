"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const types_1 = require("@shared/types");
const invoiceController_1 = require("./invoiceController");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/invoices/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF and image files are allowed.'));
        }
    },
});
// Create new invoice
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), invoiceController_1.createInvoice);
// Get invoice by ID
router.get('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), invoiceController_1.getInvoiceById);
// Get all invoices for a project
router.get('/project/:projectId', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), invoiceController_1.getProjectInvoices);
// Get pending contractor invoices
router.get('/contractors/pending', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), invoiceController_1.getPendingContractorInvoices);
// Get unpaid client invoices
router.get('/clients/unpaid', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), invoiceController_1.getUnpaidClientInvoices);
// Update invoice status
router.put('/:id/status', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), invoiceController_1.updateInvoiceStatus);
// Mark invoice as sent
router.put('/:id/mark-sent', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), invoiceController_1.markInvoiceAsSent);
// Mark invoice as received
router.put('/:id/mark-received', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), invoiceController_1.markInvoiceAsReceived);
// Send payment reminder
router.post('/:id/send-reminder', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), invoiceController_1.sendPaymentReminder);
// Add attachment to invoice
router.post('/:id/attachments', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)([types_1.UserRole.ADMIN, types_1.UserRole.MANAGER]), upload.single('attachment'), invoiceController_1.addAttachment);
exports.default = router;
//# sourceMappingURL=invoiceRoutes.js.map