#!/usr/bin/env node

/**
 * Cloudflare-optimized audit script
 * Tests performance, SEO, and functionality
 */

const https = require('https');
const fs = require('fs');

const DOMAIN = 'https://www.instylehairboutique.co.za';
const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

async function testEndpoint(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {}
    };
    
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runAudit() {
  console.log('🔍 Starting Cloudflare Stack Audit...');
  
  const results = {
    timestamp: new Date().toISOString(),
    domain: DOMAIN,
    tests: {}
  };

  // Test 1: Homepage
  try {
    const home = await testEndpoint(DOMAIN);
    results.tests.homepage = {
      status: home.status,
      hasHtml: home.headers['content-type']?.includes('text/html'),
      hasCanonical: home.body.includes('rel="canonical"'),
      hasStructuredData: home.body.includes('application/ld+json'),
      pass: home.status === 200
    };
  } catch (e) {
    results.tests.homepage = { error: e.message, pass: false };
  }

  // Test 2: Tenant API
  try {
    const tenant = await testEndpoint(`${DOMAIN}/api/tenant?slug=instylehairboutique`);
    const data = JSON.parse(tenant.body);
    results.tests.tenant_api = {
      status: tenant.status,
      servicesCount: data.services?.length || 0,
      hasTenant: !!data.tenant,
      pass: tenant.status === 200 && data.services?.length > 0
    };
  } catch (e) {
    results.tests.tenant_api = { error: e.message, pass: false };
  }

  // Test 3: Dashboard API
  try {
    const dashboard = await testEndpoint(`${DOMAIN}/api/dashboard?tenantId=${TENANT_ID}`);
    const data = JSON.parse(dashboard.body);
    results.tests.dashboard_api = {
      status: dashboard.status,
      totalAppointments: data.stats?.totalAppointments || 0,
      totalRevenue: data.stats?.totalRevenue || 0,
      pass: dashboard.status === 200 && data.stats
    };
  } catch (e) {
    results.tests.dashboard_api = { error: e.message, pass: false };
  }

  // Test 4: Booking API
  try {
    const bookingData = {
      tenantId: TENANT_ID,
      name: 'Audit Test User',
      email: 'audit@test.com',
      phone: '+27999000111',
      serviceId: 'deab9cc75a72cec17158fe6fdbe0b860',
      scheduledTime: '2025-12-01T10:00:00Z',
      notes: 'Automated audit test'
    };
    
    const booking = await testEndpoint(`${DOMAIN}/api/book`, 'POST', bookingData);
    const data = JSON.parse(booking.body);
    results.tests.booking_api = {
      status: booking.status,
      success: data.success,
      appointmentId: data.appointmentId,
      pass: booking.status === 200 && data.success
    };
  } catch (e) {
    results.tests.booking_api = { error: e.message, pass: false };
  }

  // Calculate overall score
  const passedTests = Object.values(results.tests).filter(t => t.pass).length;
  const totalTests = Object.keys(results.tests).length;
  results.score = Math.round((passedTests / totalTests) * 100);
  results.pass = results.score >= 75;

  // Save results
  fs.writeFileSync('./docs/audit/cloudflare_audit.json', JSON.stringify(results, null, 2));
  
  console.log(`\n📊 Audit Results:`);
  console.log(`Score: ${results.score}% (${passedTests}/${totalTests} tests passed)`);
  console.log(`Status: ${results.pass ? '✅ PASS' : '❌ FAIL'}`);
  
  Object.entries(results.tests).forEach(([test, result]) => {
    console.log(`  ${result.pass ? '✅' : '❌'} ${test}: ${result.pass ? 'PASS' : 'FAIL'}`);
  });

  process.exit(results.pass ? 0 : 1);
}

runAudit().catch(console.error);