import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BillingCycleRepository } from '@/repositories/billingCycle-repository';
import { BillingCycleService, ConflictError, NotFoundError } from '@/services/billingCycle-service';

const billingCycleCreateSchema = z.object({
    name: z.string().min(1),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(1900).max(2100),
});

const billingCycleUpdateSchema = billingCycleCreateSchema.partial();

export async function GET() {
    try {
        const service = new BillingCycleService(new BillingCycleRepository());
        const billingCycles = await service.listBillingCycles();
        return NextResponse.json(billingCycles, { status: 200 });
    } catch (err) {
        console.error('GET /api/billingCycle error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const parsed = billingCycleCreateSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation error', details: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const service = new BillingCycleService(new BillingCycleRepository());
        const created = await service.createBillingCycle(parsed.data);
        return NextResponse.json(created, { status: 201 });
    } catch (err) {
        if (err instanceof ConflictError) {
            return NextResponse.json({ error: err.message }, { status: 409 });
        }
        console.error('POST /api/billingCycle error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}