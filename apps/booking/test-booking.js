

async function testBooking() {
    try {
        const response = await fetch('http://localhost:3000/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
                name: 'Agent Test',
                email: 'agent_test_local@example.com',
                phone: '0000000000',
                serviceId: '1',
                scheduledTime: '2025-11-25T10:00:00Z',
                notes: 'Agent verification local'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Body:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testBooking();
