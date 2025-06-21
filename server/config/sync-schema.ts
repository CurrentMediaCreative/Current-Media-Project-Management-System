import { db } from './database';
import { schema } from './schema';

export async function syncSchema() {
  try {
    await db.query(schema);
    console.log('Database schema synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error synchronizing database schema:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  syncSchema()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
