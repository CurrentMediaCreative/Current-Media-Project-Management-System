import express from 'express';
import { login, validate } from './authController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/validate', authMiddleware, validate);

export default router;
