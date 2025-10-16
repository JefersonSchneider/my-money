export class ConflictError extends Error {
}
export class NotFoundError extends Error {
}
export class CreditService {
    constructor(repository) {
        this.repository = repository;
    }
    async listCredits() {
        return this.repository.list();
    }
    async getCreditById(id) {
        const credit = await this.repository.getById(id);
        if (!credit)
            throw new NotFoundError("Credit not found");
        return credit;
    }
    async createCredit(data) {
        // exemplo: verificar se já existe credit com mesmo name e billingCycleId
        const existing = (await this.repository.list()).find(c => c.name === data.name && c.billingCycleId === data.billingCycleId);
        if (existing)
            throw new ConflictError("Credit already exists in this billing cycle");
        return this.repository.create(data);
    }
    async updateCredit(id, data) {
        // opcional: checar existência antes de atualizar
        const credit = await this.repository.getById(id);
        if (!credit)
            throw new NotFoundError("Credit not found");
        return this.repository.update(id, data);
    }
    async deleteCredit(id) {
        const credit = await this.repository.getById(id);
        if (!credit)
            throw new NotFoundError("Credit not found");
        await this.repository.delete(id);
    }
}
