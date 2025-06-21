import express, { Request } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { uploadDocument, getDocument, deleteDocument } from './documentController';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Optional: Add file filter if needed
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // Add any file type restrictions here if needed
  cb(null, true);
};

const upload = multer({ 
  storage,
  fileFilter
});

// Upload a document
router.post('/', authMiddleware, upload.single('file'), uploadDocument);

// Get a document
router.get('/:id', authMiddleware, getDocument);

// Delete a document
router.delete('/:id', authMiddleware, deleteDocument);

export default router;
