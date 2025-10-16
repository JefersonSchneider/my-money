import prisma from "@/lib/prisma";

export type BillingCycle = {
    id: number;
    name: string;
    month: number;
    year: number;
    createdAt: Date;
    updatedAt: Date;
    credits?: Array<{
        id: number;
        name: string;
        value: number;
    }>;
    debts?: Array<{
        id: number;
        name: string;
        value: number;
        status: "PAGO" | "PENDENTE" | "AGENDADO";
    }>;
};

export class BillingCycleRepository {
    async list(): Promise<BillingCycle[]> {
        const billingCycles = await prisma.billingCycle.findMany({
            select: {
                id: true,
                name: true,
                month: true,
                year: true,
                createdAt: true,
                updatedAt: true,
                credits: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                    },
                },
                debts: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                        status: true,
                    },
                },
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });

        return billingCycles.map(bc => ({
            ...bc,
            credits: bc.credits.map(c => ({
                ...c,
                value: Number(c.value),
            })),
            debts: bc.debts.map(d => ({
                ...d,
                value: Number(d.value),
            })),
        }));
    }

    async getById(id: number): Promise<BillingCycle | null> {
        const billingCycle = await prisma.billingCycle.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                month: true,
                year: true,
                createdAt: true,
                updatedAt: true,
                credits: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                    },
                },
                debts: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                        status: true,
                    },
                },
            },
        });

        if (!billingCycle) return null;

        return {
            ...billingCycle,
            credits: billingCycle.credits.map(c => ({
                ...c,
                value: Number(c.value),
            })),
            debts: billingCycle.debts.map(d => ({
                ...d,
                value: Number(d.value),
            })),
        };
    }

    async create(data: { name: string; month: number; year: number }): Promise<BillingCycle> {
        const billingCycle = await prisma.billingCycle.create({
            data: {
                name: data.name,
                month: data.month,
                year: data.year,
            },
            select: {
                id: true,
                name: true,
                month: true,
                year: true,
                createdAt: true,
                updatedAt: true,
                credits: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                    },
                },
                debts: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                        status: true,
                    },
                },
            },
        });

        return {
            ...billingCycle,
            credits: billingCycle.credits.map(c => ({
                ...c,
                value: Number(c.value),
            })),
            debts: billingCycle.debts.map(d => ({
                ...d,
                value: Number(d.value),
            })),
        };
    }

    async update(
        id: number,
        data: Partial<{ name: string; month: number; year: number }>
    ): Promise<BillingCycle> {
        const updateData: { name?: string; month?: number; year?: number } = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.month !== undefined) updateData.month = data.month;
        if (data.year !== undefined) updateData.year = data.year;

        const billingCycle = await prisma.billingCycle.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                month: true,
                year: true,
                createdAt: true,
                updatedAt: true,
                credits: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                    },
                },
                debts: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                        status: true,
                    },
                },
            },
        });

        return {
            ...billingCycle,
            credits: billingCycle.credits.map(c => ({
                ...c,
                value: Number(c.value),
            })),
            debts: billingCycle.debts.map(d => ({
                ...d,
                value: Number(d.value),
            })),
        };
    }

    async delete(id: number): Promise<void> {
        await prisma.billingCycle.delete({ where: { id } });
    }

    async getByMonthYear(month: number, year: number): Promise<BillingCycle | null> {
        const billingCycle = await prisma.billingCycle.findUnique({
            where: {
                month_year: {
                    month,
                    year,
                },
            },
            select: {
                id: true,
                name: true,
                month: true,
                year: true,
                createdAt: true,
                updatedAt: true,
                credits: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                    },
                },
                debts: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                        status: true,
                    },
                },
            },
        });

        if (!billingCycle) return null;

        return {
            ...billingCycle,
            credits: billingCycle.credits.map(c => ({
                ...c,
                value: Number(c.value),
            })),
            debts: billingCycle.debts.map(d => ({
                ...d,
                value: Number(d.value),
            })),
        };
    }

    async listByYear(year: number): Promise<BillingCycle[]> {
        const billingCycles = await prisma.billingCycle.findMany({
            where: { year },
            select: {
                id: true,
                name: true,
                month: true,
                year: true,
                createdAt: true,
                updatedAt: true,
                credits: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                    },
                },
                debts: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                        status: true,
                    },
                },
            },
            orderBy: { month: 'asc' },
        });

        return billingCycles.map(bc => ({
            ...bc,
            credits: bc.credits.map(c => ({
                ...c,
                value: Number(c.value),
            })),
            debts: bc.debts.map(d => ({
                ...d,
                value: Number(d.value),
            })),
        }));
    }

    async count(): Promise<number> {
        return await prisma.billingCycle.count();
    }

    async listPaginated(
        page: number,
        pageSize: number = 10
    ): Promise<{ data: BillingCycle[]; total: number; pages: number }> {
        const skip = (page - 1) * pageSize;

        const billingCycles = await prisma.billingCycle.findMany({
            select: {
                id: true,
                name: true,
                month: true,
                year: true,
                createdAt: true,
                updatedAt: true,
                credits: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                    },
                },
                debts: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                        status: true,
                    },
                },
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
            skip,
            take: pageSize,
        });

        const total = await prisma.billingCycle.count();
        const pages = Math.ceil(total / pageSize);

        return {
            data: billingCycles.map(bc => ({
                ...bc,
                credits: bc.credits.map(c => ({
                    ...c,
                    value: Number(c.value),
                })),
                debts: bc.debts.map(d => ({
                    ...d,
                    value: Number(d.value),
                })),
            })),
            total,
            pages,
        };
    }

    async getConsolidatedSummary(): Promise<{
        totalCredits: number;
        totalDebts: number;
    }> {
        // Buscar todos os ciclos com seus créditos e débitos
        const billingCycles = await prisma.billingCycle.findMany({
            select: {
                credits: {
                    select: {
                        value: true,
                    },
                },
                debts: {
                    select: {
                        value: true,
                    },
                },
            },
        });

        // Consolidar valores
        let totalCredits = 0;
        let totalDebts = 0;

        billingCycles.forEach(cycle => {
            cycle.credits.forEach(credit => {
                totalCredits += Number(credit.value);
            });
            cycle.debts.forEach(debt => {
                totalDebts += Number(debt.value);
            });
        });

        return {
            totalCredits,
            totalDebts,
        };
    }
}

