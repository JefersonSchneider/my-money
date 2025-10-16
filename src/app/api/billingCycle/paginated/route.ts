import { NextResponse } from 'next/server';
import { BillingCycleRepository } from '@/repositories/billingCycle-repository';
import { BillingCycleService } from '@/services/billingCycle-service';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');

        const service = new BillingCycleService(new BillingCycleRepository());
        const result = await service.getBillingCyclesPaginated(page, pageSize);
        
        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        console.error('GET /api/billingCycle/paginated error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}