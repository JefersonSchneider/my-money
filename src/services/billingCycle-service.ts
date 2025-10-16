import { BillingCycleRepository } from "@/repositories/billingCycle-repository";

export class ConflictError extends Error { }
export class NotFoundError extends Error { }

export type BillingCycleCreateInput = {
    name: string;
    month: number;
    year: number;
};

export type BillingCycleUpdateInput = Partial<BillingCycleCreateInput>;

export class BillingCycleService {
    constructor(private repository: BillingCycleRepository) { }

    async listBillingCycles() {
        return this.repository.list();
    }

    async getBillingCycleById(id: number) {
        const billingCycle = await this.repository.getById(id);
        if (!billingCycle) throw new NotFoundError("Billing cycle not found");
        return billingCycle;
    }

    async createBillingCycle(data: BillingCycleCreateInput) {
        // verificar se já existe billing cycle com mesmo month e year
        const existing = await this.repository.getByMonthYear(data.month, data.year);
        if (existing) throw new ConflictError("Billing cycle already exists for this month/year");

        // validar mês
        if (data.month < 1 || data.month > 12) {
            throw new Error("Invalid month: must be between 1 and 12");
        }

        // validar ano
        if (data.year < 1900 || data.year > 2100) {
            throw new Error("Invalid year: must be between 1900 and 2100");
        }

        return this.repository.create(data);
    }

    async updateBillingCycle(id: number, data: BillingCycleUpdateInput) {
        // checar existência antes de atualizar
        const billingCycle = await this.repository.getById(id);
        if (!billingCycle) throw new NotFoundError("Billing cycle not found");

        // se month ou year foram alterados, verificar conflito
        if (data.month !== undefined || data.year !== undefined) {
            const month = data.month ?? billingCycle.month;
            const year = data.year ?? billingCycle.year;

            const existing = await this.repository.getByMonthYear(month, year);
            if (existing && existing.id !== id) {
                throw new ConflictError("Another billing cycle already exists for this month/year");
            }
        }

        // validar mês se fornecido
        if (data.month !== undefined && (data.month < 1 || data.month > 12)) {
            throw new Error("Invalid month: must be between 1 and 12");
        }

        // validar ano se fornecido
        if (data.year !== undefined && (data.year < 1900 || data.year > 2100)) {
            throw new Error("Invalid year: must be between 1900 and 2100");
        }

        return this.repository.update(id, data);
    }

    async deleteBillingCycle(id: number) {
        const billingCycle = await this.repository.getById(id);
        if (!billingCycle) throw new NotFoundError("Billing cycle not found");

        await this.repository.delete(id);
    }

    async getBillingCycleByMonthYear(month: number, year: number) {
        const billingCycle = await this.repository.getByMonthYear(month, year);
        if (!billingCycle) throw new NotFoundError("Billing cycle not found");
        return billingCycle;
    }

    async listBillingCyclesByYear(year: number) {
        // validar ano
        if (year < 1900 || year > 2100) {
            throw new Error("Invalid year: must be between 1900 and 2100");
        }

        return this.repository.listByYear(year);
    }

    async getBillingCycleSummary(id: number) {
        const billingCycle = await this.repository.getById(id);
        if (!billingCycle) throw new NotFoundError("Billing cycle not found");

        const totalCredits = billingCycle.credits?.reduce((sum, c) => sum + c.value, 0) || 0;
        const totalDebts = billingCycle.debts?.reduce((sum, d) => sum + d.value, 0) || 0;
        const totalPendingDebts =
            billingCycle.debts?.filter(d => d.status === "PENDENTE").reduce((sum, d) => sum + d.value, 0) || 0;
        const totalPaidDebts =
            billingCycle.debts?.filter(d => d.status === "PAGO").reduce((sum, d) => sum + d.value, 0) || 0;

        return {
            billingCycleId: billingCycle.id,
            month: billingCycle.month,
            year: billingCycle.year,
            totalCredits,
            totalDebts,
            totalPendingDebts,
            totalPaidDebts,
            balance: totalCredits - totalDebts,
        };
    }

    async countBillingCycles(): Promise<number> {
        return this.repository.count();
    }

    async getBillingCyclesPaginated(
        page: number,
        pageSize: number = 10
    ): Promise<{ data: any[]; total: number; pages: number }> {
        // validar página
        if (page < 1) throw new Error("Page must be at least 1");
        if (pageSize < 1 || pageSize > 100) throw new Error("Page size must be between 1 and 100");

        return this.repository.listPaginated(page, pageSize);
    }


    async getConsolidatedSummary(): Promise<{
        credit: number;
        debt: number;
        balance: number;
    }> {
        const { totalCredits, totalDebts } = await this.repository.getConsolidatedSummary();

        return {
            credit: totalCredits,
            debt: totalDebts,
            balance: totalCredits - totalDebts,
        };
    }
}