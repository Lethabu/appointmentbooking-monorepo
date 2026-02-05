#!/usr/bin/env node

const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const ACCOUNT = 'InStyle_Hair_Boutique';
const SCHEDULE_ID = '695384'; // From the example URLs
const BASE_URL = 'https://www.supersaas.com/api';

async function testSuperSaaSAccess() {
  console.log('🔍 Testing SuperSaaS API with Account Parameter...\n');
  
  try {
    // Test 1: Get resources with account parameter
    console.log('1. Testing resources endpoint...');
    const resourcesUrl = `${BASE_URL}/resources.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}`;
    console.log(`URL: ${resourcesUrl}`);
    
    const resourcesResponse = await fetch(resourcesUrl);
    console.log(`Status: ${resourcesResponse.status} ${resourcesResponse.statusText}`);
    
    if (resourcesResponse.ok) {
      const resources = await resourcesResponse.json();
      console.log(`✅ SUCCESS! Found ${resources.length} resource(s):`);
      resources.forEach((resource, index) => {
        console.log(`   ${index + 1}. ${resource.name} - ${resource.price ? `R${  resource.price}` : 'No price'} (${resource.duration || 'No duration'})`);
      });
    } else {
      const errorText = await resourcesResponse.text();
      console.log(`❌ Failed: ${errorText.substring(0, 200)}`);
    }
    
    console.log('\n2. Testing range/bookings endpoint...');
    const rangeUrl = `${BASE_URL}/range/${SCHEDULE_ID}.json?api_key=${API_KEY}&today=true`;
    console.log(`URL: ${rangeUrl}`);
    
    const rangeResponse = await fetch(rangeUrl);
    console.log(`Status: ${rangeResponse.status} ${rangeResponse.statusText}`);
    
    if (rangeResponse.ok) {
      const bookings = await rangeResponse.json();
      console.log(`✅ SUCCESS! Found ${bookings.length} booking(s) for today`);
      bookings.slice(0, 3).forEach((booking, index) => {
        console.log(`   ${index + 1}. ${booking.full_name || 'No name'} - ${booking.start || 'No time'} (${booking.resource_name || 'No service'})`);
      });
    } else {
      const errorText = await rangeResponse.text();
      console.log(`❌ Failed: ${errorText.substring(0, 200)}`);
    }
    
    // Test 3: Get all schedules for account
    console.log('\n3. Testing schedules endpoint...');
    const schedulesUrl = `${BASE_URL}/schedules.json?account=${ACCOUNT}&api_key=${API_KEY}`;
    console.log(`URL: ${schedulesUrl}`);
    
    const schedulesResponse = await fetch(schedulesUrl);
    console.log(`Status: ${schedulesResponse.status} ${schedulesResponse.statusText}`);
    
    if (schedulesResponse.ok) {
      const schedules = await schedulesResponse.json();
      console.log(`✅ SUCCESS! Found ${schedules.length} schedule(s):`);
      schedules.forEach((schedule, index) => {
        console.log(`   ${index + 1}. "${schedule.name}" (ID: ${schedule.id})`);
      });
    } else {
      const errorText = await schedulesResponse.text();
      console.log(`❌ Failed: ${errorText.substring(0, 200)}`);
    }
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
  }
}

testSuperSaaSAccess();