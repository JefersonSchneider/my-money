import bcrypt from 'bcryptjs';
export class ConflictError extends Error {
}
export class NotFoundError extends Error {
}
export class UserService {
    constructor(repo) {
        this.repo = repo;
    }
    async listUsers() {
        return this.repo.list();
    }
    async getUser(id) {
        const user = await this.repo.getById(id);
        if (!user)
            throw new NotFoundError('User not found');
        return user;
    }
    async createUser(input) {
        // Unicidade de email
        const existing = await this.repo.getByEmail(input.email);
        if (existing)
            throw new ConflictError('Email already in use');
        const passwordHash = await bcrypt.hash(input.password, 10);
        return this.repo.create({ name: input.name, email: input.email, passwordHash });
    }
    async updateUser(id, input) {
        // Se email for informado, verificar unicidade
        if (input.email) {
            const other = await this.repo.getByEmail(input.email);
            if (other && other.id !== id)
                throw new ConflictError('Email already in use');
        }
        const toUpdate = {};
        if (typeof input.name === 'string')
            toUpdate.name = input.name;
        if (typeof input.email === 'string')
            toUpdate.email = input.email;
        if (typeof input.password === 'string')
            toUpdate.passwordHash = await bcrypt.hash(input.password, 10);
        try {
            return await this.repo.update(id, toUpdate);
        }
        catch (err) {
            if (err.code === 'P2025')
                throw new NotFoundError('User not found');
            throw err;
        }
    }
    async deleteUser(id) {
        try {
            await this.repo.delete(id);
        }
        catch (err) {
            if (err.code === 'P2025')
                throw new NotFoundError('User not found');
            throw err;
        }
    }
}
