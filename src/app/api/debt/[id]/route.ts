import { NextResponse } from 'next/server';
import { z } from 'zod';
import { DebtRepository } from '@/repositories/debt-repository';
import { DebtService, NotFoundError } from '@/services/debt-service';

const debtUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    value: z.number().positive().optional(),
    status: z.enum(['PAGO', 'PENDENTE', 'AGENDADO']).optional(),
    billingCycleId: z.number().int().positive().optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

        const service = new DebtService(new DebtRepository());
        const debt = await service.getDebtById(id);
        return NextResponse.json(debt, { status: 200 });
    } catch (err) {
        if (err instanceof NotFoundError) {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        console.error('GET /api/debt/[id] error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

        const json = await req.json();
        const parsed = debtUpdateSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation error', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const service = new DebtService(new DebtRepository());
        const updated = await service.updateDebt(id, parsed.data);
        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        if (err instanceof NotFoundError) {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        console.error('PUT /api/debt/[id] error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

        const service = new DebtService(new DebtRepository());
        await service.deleteDebt(id);
        return new NextResponse(null, { status: 204 });
    } catch (err) {
        if (err instanceof NotFoundError) {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        console.error('DELETE /api/debt/[id] error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
