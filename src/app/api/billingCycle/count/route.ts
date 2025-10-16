import { NextResponse } from 'next/server';
import { BillingCycleRepository } from '@/repositories/billingCycle-repository';
import { BillingCycleService } from '@/services/billingCycle-service';

export async function GET() {
    try {
        const service = new BillingCycleService(new BillingCycleRepository());
        const count = await service.countBillingCycles();
        return NextResponse.json({ count, pageSize: 10 }, { status: 200 });
    } catch (err) {
        console.error('GET /api/billingCycle/count error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}