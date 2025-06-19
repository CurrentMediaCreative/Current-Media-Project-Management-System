import dotenv from 'dotenv';
import { UserModel } from '../models/User';
import { storage } from '../services/storageService';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Initialize storage
    await storage.initialize(['users']);

    // Check if admin user already exists
    const existingAdmin = await UserModel.findByEmail('admin@example.com');
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await UserModel.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'ADMIN'
    });

    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser();
