import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CreditRepository } from '@/repositories/credit-repository';
import { CreditService, NotFoundError } from '@/services/credit-service';

const creditUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    value: z.number().positive().optional(),
    billingCycleId: z.number().int().positive().optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

        const service = new CreditService(new CreditRepository());
        const credit = await service.getCreditById(id);
        return NextResponse.json(credit, { status: 200 });
    } catch (err) {
        if (err instanceof NotFoundError) {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        console.error('GET /api/credit/[id] error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

        const json = await req.json();
        const parsed = creditUpdateSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation error', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const service = new CreditService(new CreditRepository());
        const updated = await service.updateCredit(id, parsed.data);
        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        if (err instanceof NotFoundError) {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        console.error('PUT /api/credit/[id] error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

        const service = new CreditService(new CreditRepository());
        await service.deleteCredit(id);
        return new NextResponse(null, { status: 204 });
    } catch (err) {
        if (err instanceof NotFoundError) {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        console.error('DELETE /api/credit/[id] error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
