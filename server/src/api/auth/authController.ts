import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const login = async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ error: 'Admin credentials not configured' });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT secret not configured' });
    }

    const token = jwt.sign(
      { id: '1', email: adminEmail, role: 'admin' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    const user = {
      id: '1',
      email: adminEmail,
      name: 'Admin',
      role: 'admin'
    };

    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validate = async (req: Request, res: Response) => {
  try {
    // The user object is attached by the auth middleware
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
