import { DebtRepository } from "@/repositories/debt-repository";

export class ConflictError extends Error {}
export class NotFoundError extends Error {}

export type DebtCreateInput = {
    name: string;
    value: number;
    status?: "PAGO" | "PENDENTE" | "AGENDADO";
    billingCycleId: number;
};

export type DebtUpdateInput = Partial<DebtCreateInput>;

export class DebtService {
    constructor(private repository: DebtRepository) {}

    async listDebts() {
        return this.repository.list();
    }

    async getDebtById(id: number) {
        const debt = await this.repository.getById(id);
        if (!debt) throw new NotFoundError("Debt not found");
        return debt;
    }

    async createDebt(data: DebtCreateInput) {
        // verificar se já existe debt com mesmo name e billingCycleId
        const existing = (await this.repository.list()).find(
            d => d.name === data.name && d.billingCycleId === data.billingCycleId
        );
        if (existing) throw new ConflictError("Debt already exists in this billing cycle");

        return this.repository.create(data);
    }

    async updateDebt(id: number, data: DebtUpdateInput) {
        // checar existência antes de atualizar
        const debt = await this.repository.getById(id);
        if (!debt) throw new NotFoundError("Debt not found");

        return this.repository.update(id, data);
    }

    async deleteDebt(id: number) {
        const debt = await this.repository.getById(id);
        if (!debt) throw new NotFoundError("Debt not found");

        await this.repository.delete(id);
    }

    async listDebtsByStatus(status: "PAGO" | "PENDENTE" | "AGENDADO") {
        return this.repository.listByStatus(status);
    }

    async listDebtsByBillingCycle(billingCycleId: number) {
        return this.repository.listByBillingCycle(billingCycleId);
    }

    async markDebtAsPaid(id: number) {
        const debt = await this.repository.getById(id);
        if (!debt) throw new NotFoundError("Debt not found");

        return this.repository.update(id, { status: "PAGO" });
    }
}