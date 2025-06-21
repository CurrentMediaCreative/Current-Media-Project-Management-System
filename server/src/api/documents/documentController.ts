import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Express } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  file?: Express.Multer.File;
}

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const documentPath = req.file.path;
    const documentName = req.file.filename;

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        name: documentName,
        path: documentPath
      }
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

export const getDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const uploadsDir = path.join(__dirname, '../../../uploads');
    const filePath = path.join(uploadsDir, id);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({ error: 'Failed to get document' });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const uploadsDir = path.join(__dirname, '../../../uploads');
    const filePath = path.join(uploadsDir, id);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    fs.unlinkSync(filePath);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};
