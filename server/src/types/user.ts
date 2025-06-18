export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  userId: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password?: string;
  googleId?: string;
  role?: 'admin' | 'manager' | 'user';
}
