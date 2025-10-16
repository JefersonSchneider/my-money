import { NextResponse } from 'next/server';
import { z } from 'zod';
import { UserRepository } from '@/repositories/user-repository';
import { UserService, ConflictError } from '@/services/user-service';
const userCreateSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});
export async function GET() {
    try {
        const service = new UserService(new UserRepository());
        const users = await service.listUsers();
        return NextResponse.json(users, { status: 200 });
    }
    catch (err) {
        console.error('GET /api/users error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        const json = await req.json();
        const parsed = userCreateSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
        }
        const service = new UserService(new UserRepository());
        const created = await service.createUser(parsed.data);
        return NextResponse.json(created, { status: 201 });
    }
    catch (err) {
        if (err instanceof ConflictError) {
            return NextResponse.json({ error: err.message }, { status: 409 });
        }
        console.error('POST /api/users error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
