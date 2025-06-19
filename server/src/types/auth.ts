import { User } from './user';

export interface LoginInput {
  email: string;
  password?: string;
  googleId?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser extends Omit<User, 'password'> {
  token: string;
}
