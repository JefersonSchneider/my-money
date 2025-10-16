import prisma from '@/lib/prisma';
export class UserRepository {
    async list() {
        return prisma.user.findMany({
            select: { id: true, name: true, email: true, createdAt: true },
            orderBy: { id: 'asc' },
        });
    }
    async getById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, createdAt: true },
        });
    }
    async getByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, createdAt: true },
        });
    }
    async create(data) {
        return prisma.user.create({
            data: { name: data.name, email: data.email, password: data.passwordHash },
            select: { id: true, name: true, email: true, createdAt: true },
        });
    }
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.passwordHash !== undefined)
            updateData.password = data.passwordHash;
        return prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, createdAt: true },
        });
    }
    async delete(id) {
        await prisma.user.delete({ where: { id } });
    }
}
