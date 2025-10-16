import prisma from "@/lib/prisma";
export class CreditRepository {
    async list() {
        const credits = await prisma.credit.findMany({
            select: {
                id: true,
                name: true,
                value: true,
                billingCycleId: true,
                createdAt: true,
                updatedAt: true,
                billingCycle: {
                    select: {
                        id: true,
                        name: true,
                        month: true,
                        year: true,
                    },
                },
            },
            orderBy: { id: 'asc' },
        });
        // converter Decimal -> number
        return credits.map(c => ({
            ...c,
            value: Number(c.value),
        }));
    }
    async getById(id) {
        const credit = await prisma.credit.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                value: true,
                billingCycleId: true,
                createdAt: true,
                updatedAt: true,
                billingCycle: {
                    select: {
                        id: true,
                        name: true,
                        month: true,
                        year: true,
                    },
                },
            },
        });
        if (!credit)
            return null;
        return {
            ...credit,
            value: Number(credit.value), // converter Decimal -> number
        };
    }
    async create(data) {
        const credit = await prisma.credit.create({
            data: { name: data.name, value: data.value, billingCycleId: data.billingCycleId },
            select: {
                id: true,
                name: true,
                value: true,
                billingCycleId: true,
                createdAt: true,
                updatedAt: true,
                billingCycle: {
                    select: {
                        id: true,
                        name: true,
                        month: true,
                        year: true,
                    },
                },
            },
        });
        return {
            ...credit,
            value: Number(credit.value), // converter Decimal -> number
        };
    }
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.value !== undefined)
            updateData.value = data.value;
        if (data.billingCycleId !== undefined)
            updateData.billingCycleId = data.billingCycleId;
        const credit = await prisma.credit.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                value: true,
                billingCycleId: true,
                createdAt: true,
                updatedAt: true,
                billingCycle: {
                    select: {
                        id: true,
                        name: true,
                        month: true,
                        year: true,
                    },
                },
            },
        });
        // converter Decimal -> number usando spread
        return {
            ...credit,
            value: Number(credit.value),
        };
    }
    async delete(id) {
        await prisma.credit.delete({ where: { id } });
    }
}
