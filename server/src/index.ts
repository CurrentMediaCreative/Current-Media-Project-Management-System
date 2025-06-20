import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { MulterError } from 'multer';
import projectRoutes from './api/projects/projectRoutes';
import contractorRoutes from './api/contractors/contractorRateRoutes';
// import emailRoutes from './api/email/emailRoutes';  // TODO: Implement email functionality later
import dashboardRoutes from './api/dashboard/dashboardRoutes';
import clickupRoutes from './api/clickup/clickupRoutes';
import documentRoutes from './api/documents/documentRoutes';
import { storage } from './services/storageService';

// Load environment variables
dotenv.config();

// Create Express server
const app = express();

// Set port
const PORT = process.env.PORT || 3000;

// Configure CORS based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://currentmedia.ca', 'https://current-media-website-and-project.onrender.com']
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Security middleware first
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:", "file:"],
      connectSrc: ["'self'", "https://api.clickup.com", "https://current-media-website-and-project.onrender.com", "https://currentmedia.ca"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));
app.use(cors(corsOptions));

// Logging and parsing middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

// Serve static files
const landingPath = path.join(__dirname, '../../../landing');

// In production, serve landing page files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(landingPath));
}

// Initialize storage
const initializeStorage = async () => {
  try {
    // Initialize storage files if they don't exist
    await storage.initialize([
      'projects.json',
      'contractors.json',
      'notifications.json'
    ]);
    console.log('Storage initialized');
    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    if (process.env.NODE_ENV === 'development') {
      console.warn('Running in development mode without storage initialization');
      return false;
    } else {
      process.exit(1);
    }
  }
};

// API routes
const apiRouter = express.Router();
apiRouter.get('/', (_req, res) => {
  res.json({ message: 'Current Media Project Management System API' });
});
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/contractors', contractorRoutes);
// apiRouter.use('/email', emailRoutes);  // TODO: Implement email functionality later
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/clickup', clickupRoutes);
apiRouter.use('/documents', documentRoutes);

// Mount API routes under /api
app.use('/api', apiRouter);

// Handle landing page routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
    } else {
      res.sendFile(path.join(landingPath, 'index.html'));
    }
  });
}

// Error handling middleware
const errorHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
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

  // Log error details in development only
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error details:', err);
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
};

app.use(errorHandler);

// Handle 404s
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start server
const startServer = async () => {
  try {
    const storageInitialized = await initializeStorage();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (!storageInitialized && process.env.NODE_ENV === 'development') {
        console.log('Note: Server is running without storage initialization in development mode');
        console.log('Some features requiring storage access will not work');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
