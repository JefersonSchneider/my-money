import { NextResponse } from 'next/server';
import { z } from 'zod';
import { UserRepository } from '@/repositories/user-repository';
import { UserService, ConflictError, NotFoundError } from '@/services/user-service';
const idParam = z.coerce.number().int().positive();
const userUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
});
export async function GET(_req, context // <-- Ajuste aqui
) {
    try {
        const { id } = await context.params; // resolve a Promise do Next
        const parsedId = idParam.parse(id); // valida o id
        const service = new UserService(new UserRepository());
        const user = await service.getUser(parsedId);
        return NextResponse.json(user, { status: 200 });
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        }
        console.error('GET /api/users/[id] error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
export async function PATCH(req, context // <-- ajuste aqui
) {
    try {
        const { id } = await context.params; // resolve a Promise
        const parsedId = idParam.parse(id); // valida o id
        const json = await req.json();
        const parsed = userUpdateSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 400 });
        }
        const service = new UserService(new UserRepository());
        const updated = await service.updateUser(parsedId, parsed.data);
        return NextResponse.json(updated, { status: 200 });
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }
        if (err instanceof ConflictError) {
            return NextResponse.json({ error: err.message }, { status: 409 });
        }
        if (err instanceof NotFoundError) {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        console.error('PATCH /api/users/[id] error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
export async function DELETE(_req, context // <-- ajuste aqui
) {
    try {
        const { id } = await context.params; // resolve a Promise
        const parsedId = idParam.parse(id); // valida o id
        const service = new UserService(new UserRepository());
        await service.deleteUser(parsedId);
        return NextResponse.json({ success: true }, { status: 200 });
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        }
        if (err instanceof NotFoundError) {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        console.error('DELETE /api/users/[id] error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
