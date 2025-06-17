import express, { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Extend Express Request to include file from multer
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}
import { authenticate, authorize } from '../../middleware/authMiddleware';
import { UserRole } from '@shared/types';
import {
  createInvoice,
  getInvoiceById,
  getProjectInvoices,
  getPendingContractorInvoices,
  getUnpaidClientInvoices,
  updateInvoiceStatus,
  markInvoiceAsSent,
  markInvoiceAsReceived,
  sendPaymentReminder,
  addAttachment,
} from './invoiceController';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/invoices/');
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and image files are allowed.'));
    }
  },
});

// Create new invoice
router.post('/', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), createInvoice);

// Get invoice by ID
router.get('/:id', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), getInvoiceById);

// Get all invoices for a project
router.get('/project/:projectId', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), getProjectInvoices);

// Get pending contractor invoices
router.get('/contractors/pending', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), getPendingContractorInvoices);

// Get unpaid client invoices
router.get('/clients/unpaid', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), getUnpaidClientInvoices);

// Update invoice status
router.put('/:id/status', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), updateInvoiceStatus);

// Mark invoice as sent
router.put('/:id/mark-sent', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), markInvoiceAsSent);

// Mark invoice as received
router.put('/:id/mark-received', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), markInvoiceAsReceived);

// Send payment reminder
router.post('/:id/send-reminder', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), sendPaymentReminder);

// Add attachment to invoice
router.post('/:id/attachments', 
  authenticate, 
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  upload.single('attachment'),
  addAttachment
);

export default router;
