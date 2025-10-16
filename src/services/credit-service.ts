import { CreditRepository } from "@/repositories/credit-repository";

export class ConflictError extends Error {}
export class NotFoundError extends Error {}

export type CreditCreateInput = {
    name: string;
    value: number;
    billingCycleId: number;
};

export type CreditUpdateInput = Partial<CreditCreateInput>;

export class CreditService {
    constructor(private repository: CreditRepository) {}

    async listCredits() {
        return this.repository.list();
    }

    async getCreditById(id: number) {
        const credit = await this.repository.getById(id);
        if (!credit) throw new NotFoundError("Credit not found");
        return credit;
    }

    async createCredit(data: CreditCreateInput) {
        // exemplo: verificar se já existe credit com mesmo name e billingCycleId
        const existing = (await this.repository.list()).find(
            c => c.name === data.name && c.billingCycleId === data.billingCycleId
        );
        if (existing) throw new ConflictError("Credit already exists in this billing cycle");

        return this.repository.create(data);
    }

    async updateCredit(id: number, data: CreditUpdateInput) {
        // opcional: checar existência antes de atualizar
        const credit = await this.repository.getById(id);
        if (!credit) throw new NotFoundError("Credit not found");

        return this.repository.update(id, data);
    }

    async deleteCredit(id: number) {
        const credit = await this.repository.getById(id);
        if (!credit) throw new NotFoundError("Credit not found");

        await this.repository.delete(id);
    }
}
