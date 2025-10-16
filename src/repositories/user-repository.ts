import prisma from '@/lib/prisma';

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

export class UserRepository {
  async list(): Promise<PublicUser[]> {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { id: 'asc' },
    });
  }

  async getById(id: number): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  async getByEmail(email: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  async create(data: { name: string; email: string; passwordHash: string }): Promise<PublicUser> {
    return prisma.user.create({
      data: { name: data.name, email: data.email, password: data.passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  async update(
    id: number,
    data: Partial<{ name: string; email: string; passwordHash: string }>
  ): Promise<PublicUser> {
    const updateData: { name?: string; email?: string; password?: string } = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.passwordHash !== undefined) updateData.password = data.passwordHash;

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
