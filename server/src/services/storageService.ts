import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');

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

export const storage = {
  read: readData,
  write: writeData,
  initialize,
};
