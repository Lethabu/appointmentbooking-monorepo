const fetch = require('node-fetch');

async function testConflict() {
    const tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
    const now = Math.floor(Date.now() / 1000);
    const startTime = now + 3600; // 1 hour from now
    const endTime = startTime + 1800; // 30 mins later

    console.log('Testing Conflict Detection API...');

    try {
        const response = await fetch('http://localhost:3000/api/bookings/check-conflict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tenantId,
                startTime,
                endTime,
                staffId: 'staff-123'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Make sure to run this against a running server. Response:', data);
        } else {
            console.log('Server not reachable or error (expected if server not running):', response.status);
        }

    } catch (e) {
        console.log('Fetch failed (Server likely down):', e.message);
    }
}

testConflict();
