import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storageService';
import { ApiError } from '../utils';
import { User, CreateUserInput, AuthUser } from '../types/user';
import { LoginInput, AuthResponse, JwtPayload } from '../types/auth';

const USERS_FILE = 'users.json';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

class AuthService {
  /**
   * Create a new user
   */
  async createUser(input: CreateUserInput): Promise<User> {
    const users = await storage.read<User[]>(USERS_FILE);
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === input.email);
    if (existingUser) {
      throw new ApiError(400, 'User already exists');
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (input.password) {
      hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    }

    const newUser: User = {
      id: uuidv4(),
      email: input.email,
      name: input.name,
      role: input.role || 'user',
      googleId: input.googleId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (hashedPassword) {
      (newUser as any).password = hashedPassword;
    }

    users.push(newUser);
    await storage.write(USERS_FILE, users);

    return newUser;
  }

  /**
   * Login user
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const users = await storage.read<User[]>(USERS_FILE);
    const user = users.find(u => u.email === input.email);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Handle Google login
    if (input.googleId) {
      if (user.googleId !== input.googleId) {
        throw new ApiError(401, 'Invalid Google account');
      }
    }
    // Handle password login
    else if (input.password) {
      const isValidPassword = await bcrypt.compare(input.password, (user as any).password || '');
      if (!isValidPassword) {
        throw new ApiError(401, 'Invalid password');
      }
    } else {
      throw new ApiError(400, 'Password or Google ID required');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const users = await storage.read<User[]>(USERS_FILE);
    const user = users.find(u => u.id === id);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User> {
    const users = await storage.read<User[]>(USERS_FILE);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new ApiError(401, 'Invalid token');
    }
  }

  /**
   * Initialize default admin user
   */
  async initializeAdminUser(email: string, password: string): Promise<void> {
    const users = await storage.read<User[]>(USERS_FILE);
    const adminExists = users.find(u => u.role === 'admin');

    if (!adminExists) {
      await this.createUser({
        email,
        name: 'Admin',
        password,
        role: 'admin'
      });
    }
  }
}

export default new AuthService();
