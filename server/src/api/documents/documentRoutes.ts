import { Router } from 'express';
import multer from 'multer';
import { documentController } from './documentController';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Apply auth middleware to all routes
router.use(authenticateToken);

// Upload a document
router.post(
  '/:projectId/:documentType',
  upload.single('file'),
  documentController.uploadDocument
);

// Download a document
router.get(
  '/:projectId/:documentType/:filename',
  documentController.downloadDocument
);

// Delete a document
router.delete(
  '/:projectId/:documentType/:filename',
  documentController.deleteDocument
);

// List documents
router.get(
  '/:projectId/:documentType',
  documentController.listDocuments
);

export default router;
