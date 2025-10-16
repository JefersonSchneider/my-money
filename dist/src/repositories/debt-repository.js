import prisma from "@/lib/prisma";
export class DebtRepository {
    async list() {
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
    async getById(id) {
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
        if (!debt)
            return null;
        return {
            ...debt,
            value: Number(debt.value), // converter Decimal -> number
        };
    }
    async create(data) {
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
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.value !== undefined)
            updateData.value = data.value;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.billingCycleId !== undefined)
            updateData.billingCycleId = data.billingCycleId;
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
    async delete(id) {
        await prisma.debt.delete({ where: { id } });
    }
    async listByStatus(status) {
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
    async listByBillingCycle(billingCycleId) {
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
