import { Pool } from 'pg';

// Create a new Pool instance with connection details from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Export a simplified db interface
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect()
};

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Cleanup function for graceful shutdown
export const cleanup = async () => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error during database cleanup:', error);
  }
};
