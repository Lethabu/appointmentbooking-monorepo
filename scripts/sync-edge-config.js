#!/usr/bin/env node
/**
 * scripts/sync-edge-config.js
 *
 * Purpose: Fetch tenant routing info from Supabase and produce a small payload
 * suitable for uploading to Vercel Edge Config.
 *
 * Notes:
 * - Requires environment variables to be set when run locally:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - This script writes a file `edge-config/tenants.json` in the repo with the
 *   mapping { "hostname": "tenantSlug" }
 * - Uploading to Vercel Edge Config must be done with an authenticated API
 *   request or manually via the Vercel dashboard. The script prints a sample
 *   curl command showing how to upload the generated file using VERCEL_TOKEN
 *   and EDGE_CONFIG_ID placeholders.
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

async function fetchTenants() {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/tenants?select=slug,hostnames`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch tenants: ${res.statusText}`);
  }
  return res.json();
}

async function main() {
  try {
    const tenants = await fetchTenants();
    const mapping = {};
    // Expect each tenant record to include `slug` and `hostnames` (array)
    for (const t of tenants) {
      const slug = t.slug;
      const hostnames = Array.isArray(t.hostnames) ? t.hostnames : [];
      for (const h of hostnames) {
        const normalized = h.replace(/^https?:\/\//, '').replace(/^www\./, '');
        mapping[normalized] = slug;
      }
    }

    const outDir = path.join(__dirname, '..', 'edge-config');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, 'tenants.json');
    fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2));
    console.log(`Wrote tenant mapping to ${outPath}`);

    console.log('\nTo upload this payload to Vercel Edge Config follow one of these options:');
    console.log('\n1) Manually upload in the Vercel dashboard:');
    console.log('   - Open your Vercel project > Edge Config > Create or Update a JSON item and paste the contents of tenants.json');

  console.log('\n2) Use the Vercel REST API (example, fill placeholders):');
  console.log('   EDGE_CONFIG_ID=<your-edge-config-id>');
  console.log('   VERCEL_TOKEN=<your-token>');
  console.log(`\n   curl -X PUT 'https://api.vercel.com/v1/edge-configs/\${EDGE_CONFIG_ID}/items' \\\n+     -H "Authorization: Bearer $VERCEL_TOKEN" \\\n+     -H "Content-Type: application/json" \\\n+     -d '@edge-config/tenants.json'`);

    console.log('\nNote: The exact REST endpoint and method may vary; consult the Vercel Edge Config docs for the correct upload command for your account.');
  } catch (err) {
    console.error('Error syncing edge config:', err);
    process.exit(1);
  }
}

main();
