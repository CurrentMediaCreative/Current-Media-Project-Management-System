import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import { uploadDocument, getDocument, deleteDocument } from './documentController';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload a document
router.post('/', authMiddleware, upload.single('file'), uploadDocument);

// Get a document
router.get('/:id', authMiddleware, getDocument);

// Delete a document
router.delete('/:id', authMiddleware, deleteDocument);

export default router;
