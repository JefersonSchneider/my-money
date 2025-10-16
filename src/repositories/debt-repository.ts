import prisma from "@/lib/prisma";

export type Debt = {
    id: number;
    name: string;
    value: number;              // converter Decimal para number no retorno
    status: "PAGO" | "PENDENTE" | "AGENDADO";
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

export class DebtRepository {
    async list(): Promise<Debt[]> {
        const debts = await prisma.debt.findMany({
            select: {
                id: true,
                name: true,
                value: true,
                status: true,
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
        return debts.map(d => ({
            ...d,
            value: Number(d.value),
        }));
    }

    async getById(id: number): Promise<Debt | null> {
        const debt = await prisma.debt.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                value: true,
                status: true,
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

        if (!debt) return null;

        return {
            ...debt,
            value: Number(debt.value), // converter Decimal -> number
        };
    }

    async create(data: {
        name: string;
        value: number;
        status?: "PAGO" | "PENDENTE" | "AGENDADO";
        billingCycleId: number;
    }): Promise<Debt> {
        const debt = await prisma.debt.create({
            data: {
                name: data.name,
                value: data.value,
                status: data.status || "PENDENTE",
                billingCycleId: data.billingCycleId,
            },
            select: {
                id: true,
                name: true,
                value: true,
                status: true,
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
            ...debt,
            value: Number(debt.value), // converter Decimal -> number
        };
    }

    async update(
        id: number,
        data: Partial<{
            name: string;
            value: number;
            status: "PAGO" | "PENDENTE" | "AGENDADO";
            billingCycleId: number;
        }>
    ): Promise<Debt> {
        const updateData: {
            name?: string;
            value?: number;
            status?: "PAGO" | "PENDENTE" | "AGENDADO";
            billingCycleId?: number;
        } = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.value !== undefined) updateData.value = data.value;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.billingCycleId !== undefined) updateData.billingCycleId = data.billingCycleId;

        const debt = await prisma.debt.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                value: true,
                status: true,
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
            ...debt,
            value: Number(debt.value),
        };
    }

    async delete(id: number): Promise<void> {
        await prisma.debt.delete({ where: { id } });
    }

    async listByStatus(status: "PAGO" | "PENDENTE" | "AGENDADO"): Promise<Debt[]> {
        const debts = await prisma.debt.findMany({
            where: { status },
            select: {
                id: true,
                name: true,
                value: true,
                status: true,
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

        return debts.map(d => ({
            ...d,
            value: Number(d.value),
        }));
    }

    async listByBillingCycle(billingCycleId: number): Promise<Debt[]> {
        const debts = await prisma.debt.findMany({
            where: { billingCycleId },
            select: {
                id: true,
                name: true,
                value: true,
                status: true,
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

        return debts.map(d => ({
            ...d,
            value: Number(d.value),
        }));
    }
}