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

// Generic read function
const readData = async <T>(filename: string): Promise<T> => {
  const filePath = path.join(DATA_DIR, filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

// Generic write function
const writeData = async <T>(filename: string, data: T): Promise<void> => {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
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
