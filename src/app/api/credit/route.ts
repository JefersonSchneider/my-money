import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CreditRepository } from '@/repositories/credit-repository';
import { CreditService, ConflictError } from '@/services/credit-service';

const creditCreateSchema = z.object({
    name: z.string().min(1),
    value: z.number().positive(),
    billingCycleId: z.number().int().positive(),
});

export async function GET() {
    try {
        const service = new CreditService(new CreditRepository());
        const credits = await service.listCredits();
        return NextResponse.json(credits, { status: 200 });
    } catch (err) {
        console.error('GET /api/credit error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const parsed = creditCreateSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation error', details: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const service = new CreditService(new CreditRepository());
        const created = await service.createCredit(parsed.data);
        return NextResponse.json(created, { status: 201 });
    } catch (err) {
        if (err instanceof ConflictError) {
            return NextResponse.json({ error: err.message }, { status: 409 });
        }
        console.error('POST /api/credit error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}       