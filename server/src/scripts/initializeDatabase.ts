import { db } from '../../config/database';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'config/schema.sql');
    console.log('Looking for schema at:', schemaPath);
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await db.query(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  } finally {
    // Close the database connection
    await db.getClient().then(client => client.release());
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { initializeDatabase };
