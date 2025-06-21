import bcrypt from 'bcryptjs';
import { storage } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'users';

export const UserModel = {
  async authenticate(email: string, password: string): Promise<User | null> {
    const users = await storage.read<User[]>(STORAGE_KEY) || [];
    const user = users.find(u => u.email === email);
    
    if (!user || !user.password) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  async findById(id: string): Promise<User | null> {
    const users = await storage.read<User[]>(STORAGE_KEY) || [];
    const user = users.find(u => u.id === id);

    if (!user) return null;

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  async findByEmail(email: string): Promise<User | null> {
    const users = await storage.read<User[]>(STORAGE_KEY) || [];
    const user = users.find(u => u.email === email);

    if (!user) return null;

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  async create(data: { email: string; password: string; name: string; role: string }): Promise<User> {
    const users = await storage.read<User[]>(STORAGE_KEY) || [];
    
    // Check if user already exists
    if (users.some(u => u.email === data.email)) {
      throw new Error(`User with email ${data.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const now = new Date();
    
    const newUser: User = {
      id: uuidv4(),
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
      createdAt: now,
      updatedAt: now
    };

    users.push(newUser);
    await storage.write(STORAGE_KEY, users);

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  },

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const users = await storage.read<User[]>(STORAGE_KEY) || [];
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[index] = {
      ...users[index],
      password: hashedPassword,
      updatedAt: new Date()
    };

    await storage.write(STORAGE_KEY, users);
  },

  async update(id: string, data: Partial<Omit<User, 'id' | 'password'>>): Promise<User> {
    const users = await storage.read<User[]>(STORAGE_KEY) || [];
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    users[index] = {
      ...users[index],
      ...data,
      updatedAt: new Date()
    };

    await storage.write(STORAGE_KEY, users);

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = users[index];
    return userWithoutPassword as User;
  }
};
