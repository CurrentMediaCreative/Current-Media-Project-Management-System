import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@example.com',
      },
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      await prisma.$disconnect();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully:', adminUser);

    // Disconnect from the database
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Run the script
createAdminUser();
