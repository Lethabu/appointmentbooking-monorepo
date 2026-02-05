#!/usr/bin/env node

const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const BASE_URL = 'https://www.supersaas.com/api';

async function testSuperSaaSAPI() {
  console.log('🔍 Testing SuperSaaS API Access (Multiple Auth Methods)...\n');
  
  const authMethods = [
    { name: 'Bearer Token', headers: { 'Authorization': `Bearer ${API_KEY}` } },
    { name: 'Basic Auth', headers: { 'Authorization': `Basic ${Buffer.from(`${API_KEY  }:`).toString('base64')}` } },
    { name: 'API Key Header', headers: { 'X-API-Key': API_KEY } },
    { name: 'Query Parameter', url: `${BASE_URL}/schedules.json?api_key=${API_KEY}`, headers: {} }
  ];
  
  for (const method of authMethods) {
    console.log(`Testing ${method.name}...`);
    
    try {
      const url = method.url || `${BASE_URL}/schedules.json`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...method.headers
        }
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS with ${method.name}`);
        console.log(`Found ${data.length} schedule(s)`);
        
        const instyleSchedule = data.find(s => s.name && s.name.toLowerCase().includes('instyle'));
        if (instyleSchedule) {
          console.log(`✅ Instyle schedule: "${instyleSchedule.name}" (ID: ${instyleSchedule.id})`);
        }
        break;
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed: ${errorText.substring(0, 100)}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

testSuperSaaSAPI();