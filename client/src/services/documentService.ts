import api from '../shared/utils/api';

export interface DocumentUploadResponse {
  message: string;
  filePath: string;
}

export interface DocumentListResponse {
  files: string[];
}

export const documentService = {
  // Upload a document
  uploadDocument: async (
    projectId: string,
    documentType: string,
    file: File
  ): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      `/documents/${projectId}/${documentType}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Download a document
  downloadDocument: async (
    projectId: string,
    documentType: string,
    filename: string
  ): Promise<Blob> => {
    const response = await api.get(
      `/documents/${projectId}/${documentType}/${filename}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  // Delete a document
  deleteDocument: async (
    projectId: string,
    documentType: string,
    filename: string
  ): Promise<void> => {
    await api.delete(`/documents/${projectId}/${documentType}/${filename}`);
  },

  // List documents
  listDocuments: async (
    projectId: string,
    documentType: string
  ): Promise<DocumentListResponse> => {
    const response = await api.get(`/documents/${projectId}/${documentType}`);
    return response.data;
  },

  // Helper to trigger file download in browser
  downloadFile: (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
