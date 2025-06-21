import express from 'express';
import cors from 'cors';
import path from 'path';
import { testConnection, cleanup } from '../config/database';
import projectRoutes from './api/projects/projectRoutes';
import clickupRoutes from './api/clickup/clickupRoutes';
import documentRoutes from './api/documents/documentRoutes';
import dashboardRoutes from './api/dashboard/dashboardRoutes';
import contractorRoutes from './api/contractors/contractorRateRoutes';
import authRoutes from './api/auth/authRoutes';
import { authMiddleware } from './middleware/authMiddleware';

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://current-media-project-management-client.onrender.com']
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes with /pms prefix
// Auth routes (unprotected)
app.use('/pms/api/auth', authRoutes);

// Protected routes
app.use('/pms/api/projects', authMiddleware, projectRoutes);
app.use('/pms/api/clickup', authMiddleware, clickupRoutes);
app.use('/pms/api/documents', authMiddleware, documentRoutes);
app.use('/pms/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/pms/api/contractors', authMiddleware, contractorRoutes);

// API 404 handler
app.use('/pms/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Root path handler
app.get('/', (req, res) => {
  res.json({ message: 'Current Media Project Management API' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Cleaning up...');
      await cleanup();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received. Cleaning up...');
      await cleanup();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
