import { PrismaClient, User as PrismaUser } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Our simplified User type that we use in the application
export type User = {
  id: string;
  email: string;
  password: string;
};

export const UserModel = {
  async authenticate(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        password: true
      }
    });
    
    if (!user || !user.password) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    // We know the user and password exist at this point
    return user as User;
  },

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        email: true,
        password: true
      }
    });

    // Only return if we have all required fields
    if (!user || !user.password) return null;
    return user as User;
  },

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }
};
