import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Button,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import { Delete, Download, Upload } from '@mui/icons-material';
import { documentService } from '../../../services/documentService';
import { ALLOWED_DOCUMENT_TYPES, DocumentType, DocumentSection } from '../../../../../shared/src/types/documents';

interface ProjectDocumentsProps {
  projectId: string;
}

const DOCUMENT_SECTIONS: DocumentSection[] = [
  { type: 'agreements', label: 'Agreements' },
  { type: 'invoices', label: 'Invoices' },
  { type: 'receipts', label: 'Receipts' }
];

const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ projectId }) => {
  const [documents, setDocuments] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Load documents for all sections
  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const documentsData: Record<string, string[]> = {};
      
      for (const section of DOCUMENT_SECTIONS) {
        const response = await documentService.listDocuments(projectId, section.type);
        documentsData[section.type] = response.files;
      }
      
      setDocuments(documentsData);
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [projectId]);

  // Handle file upload
  const handleFileUpload = async (
    documentType: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      
      await documentService.uploadDocument(projectId, documentType, file);
      await loadDocuments(); // Refresh document list
      
    } catch (err) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  // Handle file download
  const handleDownload = async (documentType: string, filename: string) => {
    try {
      setError(null);
      const blob = await documentService.downloadDocument(projectId, documentType, filename);
      documentService.downloadFile(blob, filename);
    } catch (err) {
      setError('Failed to download document');
      console.error('Error downloading document:', err);
    }
  };

  // Handle file deletion
  const handleDelete = async (documentType: string, filename: string) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    try {
      setError(null);
      await documentService.deleteDocument(projectId, documentType, filename);
      await loadDocuments(); // Refresh document list
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Project Documents
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {DOCUMENT_SECTIONS.map((section, index) => (
        <Box key={section.type} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            {section.label}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              id={`upload-${section.type}`}
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(section.type, e)}
              accept={ALLOWED_DOCUMENT_TYPES[section.type].join(',')}
            />
            <label htmlFor={`upload-${section.type}`}>
              <Button
                component="span"
                variant="outlined"
                startIcon={<Upload />}
                disabled={uploading}
              >
                Upload {section.label}
              </Button>
            </label>
          </Box>

          {documents[section.type]?.length > 0 ? (
            <List>
              {documents[section.type].map((filename) => (
                <ListItem key={filename}>
                  <ListItemText primary={filename} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() => handleDownload(section.type, filename)}
                      sx={{ mr: 1 }}
                    >
                      <Download />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(section.type, filename)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No {section.label.toLowerCase()} uploaded
            </Typography>
          )}

          {index < DOCUMENT_SECTIONS.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}
    </Paper>
  );
};

export default ProjectDocuments;
