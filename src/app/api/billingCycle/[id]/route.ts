import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BillingCycleRepository } from '@/repositories/billingCycle-repository';
import { BillingCycleService, ConflictError, NotFoundError } from '@/services/billingCycle-service';

const billingCycleUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const service = new BillingCycleService(new BillingCycleRepository());
    const billingCycle = await service.getBillingCycleById(id);
    return NextResponse.json(billingCycle, { status: 200 });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error('GET /api/billingCycle/[id] error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const json = await req.json();
    const parsed = billingCycleUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const service = new BillingCycleService(new BillingCycleRepository());
    const updated = await service.updateBillingCycle(id, parsed.data);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof ConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error('PUT /api/billingCycle/[id] error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const service = new BillingCycleService(new BillingCycleRepository());
    await service.deleteBillingCycle(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error('DELETE /api/billingCycle/[id] error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
