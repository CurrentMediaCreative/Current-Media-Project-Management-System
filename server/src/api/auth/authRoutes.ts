import express from 'express';
import { register, login, refreshToken, getProfile, logout, googleLogin } from './authController';
import { authenticate } from '../../middleware/authMiddleware';
import { validateRegistration, validateLogin, validateRefreshToken, validateGoogleLogin } from './authValidation';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/google', validateGoogleLogin, googleLogin);
router.post('/refresh', validateRefreshToken, refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getProfile);

export default router;
