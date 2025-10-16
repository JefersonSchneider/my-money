export class ConflictError extends Error {
}
export class NotFoundError extends Error {
}
export class DebtService {
    constructor(repository) {
        this.repository = repository;
    }
    async listDebts() {
        return this.repository.list();
    }
    async getDebtById(id) {
        const debt = await this.repository.getById(id);
        if (!debt)
            throw new NotFoundError("Debt not found");
        return debt;
    }
    async createDebt(data) {
        // verificar se já existe debt com mesmo name e billingCycleId
        const existing = (await this.repository.list()).find(d => d.name === data.name && d.billingCycleId === data.billingCycleId);
        if (existing)
            throw new ConflictError("Debt already exists in this billing cycle");
        return this.repository.create(data);
    }
    async updateDebt(id, data) {
        // checar existência antes de atualizar
        const debt = await this.repository.getById(id);
        if (!debt)
            throw new NotFoundError("Debt not found");
        return this.repository.update(id, data);
    }
    async deleteDebt(id) {
        const debt = await this.repository.getById(id);
        if (!debt)
            throw new NotFoundError("Debt not found");
        await this.repository.delete(id);
    }
    async listDebtsByStatus(status) {
        return this.repository.listByStatus(status);
    }
    async listDebtsByBillingCycle(billingCycleId) {
        return this.repository.listByBillingCycle(billingCycleId);
    }
    async markDebtAsPaid(id) {
        const debt = await this.repository.getById(id);
        if (!debt)
            throw new NotFoundError("Debt not found");
        return this.repository.update(id, { status: "PAGO" });
    }
}
