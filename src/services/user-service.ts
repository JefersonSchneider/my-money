import bcrypt from 'bcryptjs';
import { UserRepository, PublicUser } from '@/repositories/user-repository';

export class ConflictError extends Error {}
export class NotFoundError extends Error {}

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
};

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async listUsers(): Promise<PublicUser[]> {
    return this.repo.list();
  }

  async getUser(id: number): Promise<PublicUser> {
    const user = await this.repo.getById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async createUser(input: CreateUserInput): Promise<PublicUser> {
    // Unicidade de email
    const existing = await this.repo.getByEmail(input.email);
    if (existing) throw new ConflictError('Email already in use');

    const passwordHash = await bcrypt.hash(input.password, 10);
    return this.repo.create({ name: input.name, email: input.email, passwordHash });
  }

  async updateUser(id: number, input: UpdateUserInput): Promise<PublicUser> {
    // Se email for informado, verificar unicidade
    if (input.email) {
      const other = await this.repo.getByEmail(input.email);
      if (other && other.id !== id) throw new ConflictError('Email already in use');
    }

    const toUpdate: Partial<{ name: string; email: string; passwordHash: string }> = {};
    if (typeof input.name === 'string') toUpdate.name = input.name;
    if (typeof input.email === 'string') toUpdate.email = input.email;
    if (typeof input.password === 'string') toUpdate.passwordHash = await bcrypt.hash(input.password, 10);

    try {
      return await this.repo.update(id, toUpdate);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('User not found');
      throw err;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('User not found');
      throw err;
    }
  }
}
