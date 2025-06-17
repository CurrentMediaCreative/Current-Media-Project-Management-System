"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const multer_1 = require("multer");
const client_1 = require("@prisma/client");
const authRoutes_1 = __importDefault(require("./api/auth/authRoutes"));
const projectRoutes_1 = __importDefault(require("./api/projects/projectRoutes"));
const contractorRateRoutes_1 = __importDefault(require("./api/contractors/contractorRateRoutes"));
const invoiceRoutes_1 = __importDefault(require("./api/invoices/invoiceRoutes"));
// Load environment variables
dotenv_1.default.config();
// Create Express server
const app = (0, express_1.default)();
// Initialize Prisma Client
exports.prisma = new client_1.PrismaClient();
// Set port
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Database connection check
const checkDBConnection = async () => {
    try {
        await exports.prisma.$connect();
        console.log('Database connected');
        return true;
    }
    catch (error) {
        console.error('Database connection error:', error);
        if (process.env.NODE_ENV === 'development') {
            console.warn('Running in development mode without database connection');
            return false;
        }
        else {
            process.exit(1);
        }
    }
};
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Current Media Project Management System API' });
});
// API routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/contractors', contractorRateRoutes_1.default);
app.use('/api/invoices', invoiceRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof multer_1.MulterError) {
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
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('beforeExit', async () => {
    await exports.prisma.$disconnect();
});
startServer();
//# sourceMappingURL=index.js.map