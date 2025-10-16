import { NextResponse } from 'next/server';
import { z } from 'zod';
import { DebtRepository } from '@/repositories/debt-repository';
import { DebtService, ConflictError } from '@/services/debt-service';
const debtCreateSchema = z.object({
    name: z.string().min(1),
    value: z.number().positive(),
    status: z.enum(['PAGO', 'PENDENTE', 'AGENDADO']).optional(),
    billingCycleId: z.number().int().positive(),
});
const debtUpdateSchema = debtCreateSchema.partial();
export async function GET() {
    try {
        const service = new DebtService(new DebtRepository());
        const debts = await service.listDebts();
        return NextResponse.json(debts, { status: 200 });
    }
    catch (err) {
        console.error('GET /api/debt error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        const json = await req.json();
        const parsed = debtCreateSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Dados não aceitos. Verifique o formato informado em cada campo.', details: parsed.error.flatten() }, { status: 400 });
        }
        const service = new DebtService(new DebtRepository());
        const created = await service.createDebt(parsed.data);
        return NextResponse.json(created, { status: 201 });
    }
    catch (err) {
        if (err instanceof ConflictError) {
            return NextResponse.json({ error: err.message }, { status: 409 });
        }
        console.error('POST /api/debt error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
