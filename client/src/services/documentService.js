import api from "./authService";

/**
 * Fetch documents for a specific project
 * @param {string} projectId - Project ID
 * @returns {Promise<Array>} - Promise with documents array
 */
export const fetchDocumentsByProject = async (projectId) => {
  try {
    const response = await api.get(`/documents/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching documents for project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Fetch a document by ID
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} - Promise with document data
 */
export const fetchDocumentById = async (documentId) => {
  try {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Create a new document
 * @param {Object} documentData - Document data
 * @returns {Promise<Object>} - Promise with created document
 */
export const createDocument = async (documentData) => {
  try {
    const response = await api.post("/documents", documentData);
    return response.data;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

/**
 * Update a document
 * @param {string} documentId - Document ID
 * @param {Object} documentData - Updated document data
 * @returns {Promise<Object>} - Promise with updated document
 */
export const updateDocument = async (documentId, documentData) => {
  try {
    const response = await api.put(`/documents/${documentId}`, documentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} documentId - Document ID
 * @returns {Promise<void>} - Promise that resolves when document is deleted
 */
export const deleteDocument = async (documentId) => {
  try {
    await api.delete(`/documents/${documentId}`);
  } catch (error) {
    console.error(`Error deleting document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Upload a file attachment for a document
 * @param {string} documentId - Document ID
 * @param {File} file - File to upload
 * @returns {Promise<Object>} - Promise with attachment data
 */
export const uploadDocumentAttachment = async (documentId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/documents/${documentId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error uploading attachment for document ${documentId}:`,
      error
    );
    throw error;
  }
};
