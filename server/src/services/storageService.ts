import fs from 'fs/promises';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const DATA_DIR = path.join(__dirname, '../../data');
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Document types and their allowed file extensions
const ALLOWED_DOCUMENT_TYPES = {
  agreements: ['.pdf', '.doc', '.docx'],
  invoices: ['.pdf', '.jpg', '.jpeg', '.png'],
  receipts: ['.pdf', '.jpg', '.jpeg', '.png']
} as const;

type DocumentType = keyof typeof ALLOWED_DOCUMENT_TYPES;

// Ensure data directory exists
const initStorage = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

// Initialize a single data file if it doesn't exist
const initializeDataFile = async (filename: string, defaultData: any = []) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// Generic read function with enhanced error handling and validation
const readData = async <T>(filename: string): Promise<T> => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Validate data structure for arrays
    if (filename.endsWith('.json') && !Array.isArray(parsed)) {
      throw new Error(`Invalid data structure in ${filename}: expected array`);
    }
    
    return parsed;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(`File not found: ${filename}`);
      throw new Error(`Storage file ${filename} not found`);
    }
    if (error instanceof SyntaxError) {
      console.error(`Invalid JSON in ${filename}`);
      throw new Error(`Invalid data format in ${filename}`);
    }
    console.error(`Storage error (${filename}):`, error);
    throw new Error(`Storage operation failed: ${error.message}`);
  }
};

// Generic write function with enhanced error handling
const writeData = async <T>(filename: string, data: T): Promise<void> => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.error(`Failed to write to ${filename}:`, error);
    throw new Error(`Failed to write to storage: ${error.message}`);
  }
};

// Initialize storage with specified files
const initialize = async (files: string[]) => {
  await initStorage();
  
  // Initialize each file with an empty array as default
  for (const file of files) {
    await initializeDataFile(file, []);
  }
};

// Create project directory structure
const createProjectStructure = async (projectId: string) => {
  const projectDir = path.join(UPLOADS_DIR, projectId);
  
  try {
    // Create main project directory
    await fs.mkdir(projectDir, { recursive: true });
    
    // Create subdirectories for each document type
    for (const docType of Object.keys(ALLOWED_DOCUMENT_TYPES)) {
      await fs.mkdir(path.join(projectDir, docType), { recursive: true });
    }
  } catch (error: any) {
    console.error(`Failed to create project structure for ${projectId}:`, error);
    throw new Error(`Failed to create project structure: ${error.message}`);
  }
};

// Validate file type against allowed extensions
const validateFileType = (filename: string, docType: DocumentType): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_DOCUMENT_TYPES[docType].includes(ext as any);
};

// Store a document file
const storeDocument = async (
  projectId: string,
  docType: DocumentType,
  filename: string,
  fileStream: NodeJS.ReadableStream
): Promise<string> => {
  if (!validateFileType(filename, docType)) {
    throw new Error(`Invalid file type for ${docType}. Allowed: ${ALLOWED_DOCUMENT_TYPES[docType].join(', ')}`);
  }

  const projectDir = path.join(UPLOADS_DIR, projectId, docType);
  const filePath = path.join(projectDir, filename);
  
  try {
    // Ensure project structure exists
    await createProjectStructure(projectId);
    
    // Write file using streams
    const writeStream = createWriteStream(filePath);
    await pipeline(fileStream, writeStream);
    
    return filePath;
  } catch (error: any) {
    console.error(`Failed to store document for project ${projectId}:`, error);
    throw new Error(`Failed to store document: ${error.message}`);
  }
};

// Retrieve a document file stream
const getDocumentStream = async (
  projectId: string,
  docType: DocumentType,
  filename: string
): Promise<NodeJS.ReadableStream> => {
  const filePath = path.join(UPLOADS_DIR, projectId, docType, filename);
  
  try {
    // Check if file exists
    await fs.access(filePath);
    return createReadStream(filePath);
  } catch (error: any) {
    console.error(`Failed to retrieve document for project ${projectId}:`, error);
    throw new Error(`Document not found: ${filename}`);
  }
};

// Delete a document
const deleteDocument = async (
  projectId: string,
  docType: DocumentType,
  filename: string
): Promise<void> => {
  const filePath = path.join(UPLOADS_DIR, projectId, docType, filename);
  
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    console.error(`Failed to delete document for project ${projectId}:`, error);
    throw new Error(`Failed to delete document: ${error.message}`);
  }
};

// List documents in a project directory
const listDocuments = async (
  projectId: string,
  docType: DocumentType
): Promise<string[]> => {
  const projectDir = path.join(UPLOADS_DIR, projectId, docType);
  
  try {
    const files = await fs.readdir(projectDir);
    return files;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error(`Failed to list documents for project ${projectId}:`, error);
    throw new Error(`Failed to list documents: ${error.message}`);
  }
};

export const storage = {
  // JSON data storage
  read: readData,
  write: writeData,
  initialize,
  
  // Document storage
  createProjectStructure,
  storeDocument,
  getDocumentStream,
  deleteDocument,
  listDocuments,
  
  // Constants
  ALLOWED_DOCUMENT_TYPES
};
