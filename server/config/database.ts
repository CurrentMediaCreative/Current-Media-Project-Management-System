import { Pool } from 'pg';

// Create a new Pool instance with connection details from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Export a simplified db interface
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect()
};

// Test database connection with retries
export const testConnection = async () => {
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting database connection (attempt ${attempt}/${maxRetries})...`);
      const client = await pool.connect();
      console.log('Database connection successful');
      client.release();
      return true;
    } catch (error) {
      console.error(`Database connection error (attempt ${attempt}/${maxRetries}):`, error);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  return false;
};

// Cleanup function for graceful shutdown
export const cleanup = async () => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error during database cleanup:', error);
  }
};
