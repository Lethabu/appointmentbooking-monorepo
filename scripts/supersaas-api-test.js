#!/usr/bin/env node

const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const BASE_URL = 'https://www.supersaas.com/api';

async function testSuperSaaSAPI() {
  console.log('🔍 Testing SuperSaaS API Access...\n');
  
  try {
    // Test 1: Get all schedules
    console.log('1. Fetching schedules...');
    const schedulesResponse = await fetch(`${BASE_URL}/schedules.json`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (schedulesResponse.ok) {
      const schedules = await schedulesResponse.json();
      console.log(`✅ Found ${schedules.length} schedule(s)`);
      
      const instyleSchedule = schedules.find(s => s.name.includes('Instyle'));
      if (instyleSchedule) {
        console.log(`✅ Instyle schedule found: "${instyleSchedule.name}" (ID: ${instyleSchedule.id})`);
        
        // Test 2: Get schedule details
        console.log('\n2. Fetching schedule details...');
        const detailsResponse = await fetch(`${BASE_URL}/schedules/${instyleSchedule.id}.json`, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (detailsResponse.ok) {
          const details = await detailsResponse.json();
          console.log('✅ Schedule details retrieved');
          console.log(`   Name: ${details.name}`);
          console.log(`   Type: ${details.schedule_type}`);
          console.log(`   Active: ${details.active}`);
        }
        
        // Test 3: Get resources/services
        console.log('\n3. Fetching services/resources...');
        const resourcesResponse = await fetch(`${BASE_URL}/schedules/${instyleSchedule.id}/resources.json`, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (resourcesResponse.ok) {
          const resources = await resourcesResponse.json();
          console.log(`✅ Found ${resources.length} service(s):`);
          resources.forEach((service, index) => {
            console.log(`   ${index + 1}. ${service.name} - R${service.price} (${service.duration}min)`);
          });
        }
        
        // Test 4: Get recent bookings
        console.log('\n4. Fetching recent bookings...');
        const bookingsResponse = await fetch(`${BASE_URL}/schedules/${instyleSchedule.id}/bookings.json?limit=5`, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (bookingsResponse.ok) {
          const bookings = await bookingsResponse.json();
          console.log(`✅ Found ${bookings.length} recent booking(s)`);
          bookings.forEach((booking, index) => {
            console.log(`   ${index + 1}. ${booking.full_name} - ${booking.start} (${booking.resource_name})`);
          });
        }
        
      } else {
        console.log('❌ Instyle schedule not found');
      }
    } else {
      console.log(`❌ API Error: ${schedulesResponse.status} ${schedulesResponse.statusText}`);
    }
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
  }
}

testSuperSaaSAPI();