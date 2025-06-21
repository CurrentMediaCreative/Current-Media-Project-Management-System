import { Request } from 'express';
import { Express } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  file?: Express.Multer.File;
  params: Request['params'];
  body: Request['body'];
  query: Request['query'];
  headers: Request['headers'];
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface LoginInput {
  email: string;
  password?: string;
  googleId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
