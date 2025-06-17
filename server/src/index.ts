import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { MulterError } from 'multer';
import { PrismaClient } from '@prisma/client';
import authRoutes from './api/auth/authRoutes';
import projectRoutes from './api/projects/projectRoutes';
import contractorRoutes from './api/contractors/contractorRateRoutes';
import invoiceRoutes from './api/invoices/invoiceRoutes';

// Load environment variables
dotenv.config();

// Create Express server
const app = express();

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Set port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection check
const checkDBConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    if (process.env.NODE_ENV === 'development') {
      console.warn('Running in development mode without database connection');
      return false;
    } else {
      process.exit(1);
    }
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Current Media Project Management System API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/invoices', invoiceRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 5MB.',
        error: err,
      });
    }
    return res.status(400).json({
      message: 'File upload error',
      error: err,
    });
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// Start server
const startServer = async () => {
  try {
    const dbConnected = await checkDBConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (!dbConnected && process.env.NODE_ENV === 'development') {
        console.log('Note: Server is running without database connection in development mode');
        console.log('Some features requiring database access will not work');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

startServer();
