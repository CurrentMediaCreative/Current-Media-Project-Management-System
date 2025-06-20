import { Request, Response } from 'express';
import { storage } from '../../services/storageService';
import { Readable } from 'stream';
import { AuthenticatedRequest } from '../../types/auth';

export const documentController = {
  // Upload a document
  uploadDocument: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { projectId, documentType } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      if (!Object.keys(storage.ALLOWED_DOCUMENT_TYPES).includes(documentType)) {
        return res.status(400).json({ error: 'Invalid document type' });
      }

      // Convert buffer to stream
      const stream = Readable.from(file.buffer);
      
      const filePath = await storage.storeDocument(
        projectId,
        documentType as keyof typeof storage.ALLOWED_DOCUMENT_TYPES,
        file.originalname,
        stream
      );

      res.json({ 
        message: 'Document uploaded successfully',
        filePath 
      });
    } catch (error: any) {
      console.error('Document upload error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Download a document
  downloadDocument: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { projectId, documentType, filename } = req.params;

      if (!Object.keys(storage.ALLOWED_DOCUMENT_TYPES).includes(documentType)) {
        return res.status(400).json({ error: 'Invalid document type' });
      }

      const stream = await storage.getDocumentStream(
        projectId,
        documentType as keyof typeof storage.ALLOWED_DOCUMENT_TYPES,
        filename
      );

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      stream.pipe(res);
    } catch (error: any) {
      console.error('Document download error:', error);
      res.status(error.message.includes('not found') ? 404 : 500)
         .json({ error: error.message });
    }
  },

  // Delete a document
  deleteDocument: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { projectId, documentType, filename } = req.params;

      if (!Object.keys(storage.ALLOWED_DOCUMENT_TYPES).includes(documentType)) {
        return res.status(400).json({ error: 'Invalid document type' });
      }

      await storage.deleteDocument(
        projectId,
        documentType as keyof typeof storage.ALLOWED_DOCUMENT_TYPES,
        filename
      );

      res.json({ message: 'Document deleted successfully' });
    } catch (error: any) {
      console.error('Document deletion error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // List documents
  listDocuments: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { projectId, documentType } = req.params;

      if (!Object.keys(storage.ALLOWED_DOCUMENT_TYPES).includes(documentType)) {
        return res.status(400).json({ error: 'Invalid document type' });
      }

      const files = await storage.listDocuments(
        projectId,
        documentType as keyof typeof storage.ALLOWED_DOCUMENT_TYPES
      );

      res.json({ files });
    } catch (error: any) {
      console.error('Document listing error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
