#!/usr/bin/env node

/**
 * Production API Verification Script
 * Tests the live Instyle tenant API to ensure correct services are returned
 */

const https = require('https');

const TENANT_API_URL = 'https://www.instylehairboutique.co.za/api/tenant?slug=instylehairboutique';

const EXPECTED_SERVICES = [
  { name: 'Middle & Side Installation', price: 30000, duration_minutes: 60 },
  { name: 'Maphondo & Lines Installation', price: 35000, duration_minutes: 60 },
  { name: 'Soft Glam Makeup', price: 45000, duration_minutes: 120 },
  { name: 'Gel Maphondo Styling', price: 35000, duration_minutes: 120 },
  { name: 'Frontal Ponytail Installation', price: 95000, duration_minutes: 120 }
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function verifyAPI() {
  console.log('🔍 Verifying Instyle Tenant API...');
  console.log(`📡 Testing: ${TENANT_API_URL}`);
  
  try {
    const response = await makeRequest(TENANT_API_URL);
    
    console.log('\n✅ API Response received');
    console.log('📋 Tenant Info:', response.tenant);
    
    if (!response.services || !Array.isArray(response.services)) {
      throw new Error('Services array not found in response');
    }
    
    console.log(`\n🔢 Services Count: ${response.services.length} (Expected: 5)`);
    
    if (response.services.length !== 5) {
      console.error('❌ FAIL: Incorrect number of services');
      return false;
    }
    
    console.log('\n📊 Service Verification:');
    let allCorrect = true;
    
    EXPECTED_SERVICES.forEach((expected, index) => {
      const actual = response.services.find(s => s.name === expected.name);
      
      if (!actual) {
        console.error(`❌ Missing service: ${expected.name}`);
        allCorrect = false;
        return;
      }
      
      const priceMatch = actual.price === expected.price;
      const durationMatch = actual.duration_minutes === expected.duration_minutes;
      
      console.log(`${priceMatch && durationMatch ? '✅' : '❌'} ${actual.name}`);
      console.log(`   Price: R${actual.price/100} (Expected: R${expected.price/100}) ${priceMatch ? '✅' : '❌'}`);
      console.log(`   Duration: ${actual.duration_minutes}min (Expected: ${expected.duration_minutes}min) ${durationMatch ? '✅' : '❌'}`);
      
      if (!priceMatch || !durationMatch) {
        allCorrect = false;
      }
    });
    
    if (allCorrect) {
      console.log('\n🎉 SUCCESS: All services match expected values!');
      console.log('✅ Instyle tenant is ready for production');
      return true;
    } else {
      console.log('\n❌ FAIL: Service data mismatch detected');
      return false;
    }
    
  } catch (error) {
    console.error('\n❌ API Test Failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  verifyAPI().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { verifyAPI };