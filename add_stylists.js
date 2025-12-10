#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://awrnkvjitzwzojaonrzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cm5rdmppdHp3em9qYW9ucnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzAzODQsImV4cCI6MjA2NTkwNjM4NH0.7ueNZeQZf6eUe-Q-Hu3vnid5SaFk3JT2Oxx0v5loAU4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Add stylist employees for Instyle
async function addStylists() {
    const tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

    const stylists = [
        { id: 'zanele', name: 'Zanele', email: 'zanele@instyle.co.za' },
        { id: 'tshenolo', name: 'Tshenolo', email: 'tshenolo@instyle.co.za' },
        { id: 'chifiwa', name: 'Chifiwa', email: 'chifiwa@instyle.co.za' }
    ];

    for (const stylist of stylists) {
        console.log('Adding stylist:', stylist.name);
        const { data, error } = await supabase
            .from('employees')
            .upsert({
                id: stylist.id,
                tenant_id: tenantId,
                name: stylist.name,
                email: stylist.email,
                is_active: true
            }, { onConflict: 'id' });

        if (error) {
            console.error('Error adding stylist:', stylist.name, error);
        } else {
            console.log('✓ Added stylist:', stylist.name);
        }
    }

    console.log('Stylist addition complete');

    // Check current employees
    const { data: employees, error: queryError } = await supabase
        .from('employees')
        .select('*')
        .eq('tenant_id', tenantId);

    if (queryError) {
        console.error('Error querying employees:', queryError);
    } else {
        console.log('Current employees for Instyle:', JSON.stringify(employees, null, 2));
    }
}

if (require.main === module) {
    addStylists().catch(console.error);
}
