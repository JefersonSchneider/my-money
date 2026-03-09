export function showUpdate(billingCycle) {
    return [    
        {
            type: 'BILLING_CYCLE_SHOW_UPDATE',
            payload: billingCycle
        }
    ]
}