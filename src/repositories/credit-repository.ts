import prisma from "@/lib/prisma";

export type Credit = {
    id: number;
    name: string;
    value: number;              // converter Decimal para number no retorno
    billingCycleId: number;     // id do ciclo relacionado
    createdAt: Date;
    updatedAt: Date;
    billingCycle?: {            // se quiser incluir dados do ciclo
        id: number;
        name: string;
        month: number;
        year: number;
    };
};

export class CreditRepository {
    async list(): Promise<Credit[]> {
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
    async getById(id: number): Promise<Credit | null> {
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

        if (!credit) return null;

        return {
            ...credit,
            value: Number(credit.value), // converter Decimal -> number
        };
    }
    async create(data: { name: string; value: number; billingCycleId: number }): Promise<Credit> {
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

    async update(
        id: number,
        data: Partial<{ name: string; value: number; billingCycleId: number }>
    ): Promise<Credit> {
        const updateData: { name?: string; value?: number; billingCycleId?: number } = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.value !== undefined) updateData.value = data.value;
        if (data.billingCycleId !== undefined) updateData.billingCycleId = data.billingCycleId;

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


    async delete(id: number): Promise<void> {
        await prisma.credit.delete({ where: { id } });
    }
}


