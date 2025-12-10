// Simple integration checks for deployed Worker endpoints
const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
const BASE = process.env.DEPLOY_URL || 'https://www.instylehairboutique.co.za';

async function check(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  const body = await res.json();
  return body;
}

async function run() {
  console.log('Running Worker integration tests against', BASE);
  const endpoints = [
    `/api/dashboard?tenantId=${TENANT_ID}`,
    `/api/dashboard/bookings?tenantId=${TENANT_ID}&limit=5`,
    `/api/health`
  ];

  for (const ep of endpoints) {
    const url = BASE + ep;
    process.stdout.write(`Checking ${ep} ... `);
    try {
      const body = await check(url);
      const keys = Object.keys(body);
      console.log('OK (keys:', keys.join(','), ')');
    } catch (err) {
      console.error('FAILED');
      console.error(err);
      process.exit(2);
    }
  }

  console.log('All worker endpoint checks passed');
}

run().catch((e) => { console.error(e); process.exit(2); });
