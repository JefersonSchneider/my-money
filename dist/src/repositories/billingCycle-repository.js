import prisma from "@/lib/prisma";
export class BillingCycleRepository {
    async list() {
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
    async getById(id) {
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
        if (!billingCycle)
            return null;
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
    async create(data) {
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
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.month !== undefined)
            updateData.month = data.month;
        if (data.year !== undefined)
            updateData.year = data.year;
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
    async delete(id) {
        await prisma.billingCycle.delete({ where: { id } });
    }
    async getByMonthYear(month, year) {
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
        if (!billingCycle)
            return null;
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
    async listByYear(year) {
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
    async count() {
        return await prisma.billingCycle.count();
    }
    async listPaginated(page, pageSize = 10) {
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
    async getConsolidatedSummary() {
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
