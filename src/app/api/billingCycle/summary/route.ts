import { NextResponse } from 'next/server';
import { BillingCycleRepository } from '@/repositories/billingCycle-repository';
import { BillingCycleService } from '@/services/billingCycle-service';

export async function GET() {
    console.log('teste');
    try {
        const service = new BillingCycleService(new BillingCycleRepository());
        const summary = await service.getConsolidatedSummary();
        
        return NextResponse.json(summary, { status: 200 });
        console.log('Summary:', summary);
        console.log('teste');
    } catch (err) {
        console.error('GET /api/billingCycle/summary error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}