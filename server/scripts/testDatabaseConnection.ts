import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the server's .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testConnection() {
  // Use external database URL
  const dbUrl = 'postgresql://current_media_db_2qtd_user:3grlO4heTBnzAsQA38OnWQ1n2Iqd2Egc@dpg-d1bbj8adbo4c73cc6v90-a.oregon-postgres.render.com/current_media_db_2qtd';
  
  console.log('Testing database connection...');
  console.log('Database URL:', dbUrl);

  const pool = new Pool({
    host: 'dpg-d1bbj8adbo4c73cc6v90-a.oregon-postgres.render.com',
    port: 5432,
    user: 'current_media_db_2qtd_user',
    password: '3grlO4heTBnzAsQA38OnWQ1n2Iqd2Egc',
    database: 'current_media_db_2qtd',
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000, // 10 seconds
    idleTimeoutMillis: 30000, // 30 seconds
    max: 1, // Limit to 1 connection for testing
    keepAlive: true // Enable TCP keepalive
  });

  // Add error handler to see more details
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  const maxRetries = 5;
  const retryDelay = 3000; // 3 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\nAttempt ${attempt}/${maxRetries}...`);
      const client = await pool.connect();
      console.log('Successfully connected to database!');
      
      // Try a simple query
      const result = await client.query('SELECT NOW()');
      console.log('Query result:', result.rows[0]);
      
      client.release();
      await pool.end();
      return;
    } catch (error) {
      console.error(`Connection error (attempt ${attempt}/${maxRetries}):`, error);
      if (attempt < maxRetries) {
        console.log(`Waiting ${retryDelay/1000} seconds before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  console.error('Failed to connect after', maxRetries, 'attempts');
}

testConnection();
