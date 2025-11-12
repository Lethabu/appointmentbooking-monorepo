#!/usr/bin/env node

const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const ACCOUNT = 'InStyle_Hair_Boutique';
const SCHEDULE_ID = '695384';
const BASE_URL = 'https://www.supersaas.com/api';

async function deepSuperSaaSResearch() {
  console.log('🔍 DEEP SUPERSAAS API RESEARCH');
  console.log('==============================\n');
  
  const endpoints = [
    // Different API formats to try
    `/schedules/${SCHEDULE_ID}.json?account=${ACCOUNT}&api_key=${API_KEY}`,
    `/schedules/${SCHEDULE_ID}/resources.json?account=${ACCOUNT}&api_key=${API_KEY}`,
    `/resources.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}`,
    `/bookings.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}&limit=5`,
    `/range/${SCHEDULE_ID}.json?account=${ACCOUNT}&api_key=${API_KEY}&from=2024-12-01&to=2024-12-31`,
    `/appointments.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}`,
    `/users.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}`,
    
    // Try without account parameter
    `/schedules/${SCHEDULE_ID}.json?api_key=${API_KEY}`,
    `/resources.json?schedule_id=${SCHEDULE_ID}&api_key=${API_KEY}`,
    `/bookings.json?schedule_id=${SCHEDULE_ID}&api_key=${API_KEY}&limit=5`,
    
    // Try with different formats
    `/schedules.json?account=${ACCOUNT}&api_key=${API_KEY}`,
    `/forms/${SCHEDULE_ID}.json?account=${ACCOUNT}&api_key=${API_KEY}`,
    `/settings/${SCHEDULE_ID}.json?account=${ACCOUNT}&api_key=${API_KEY}`,
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📡 Testing: ${endpoint}`);
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ SUCCESS - Data type: ${Array.isArray(data) ? 'Array' : typeof data}`);
        
        if (Array.isArray(data)) {
          console.log(`   📊 Array length: ${data.length}`);
          if (data.length > 0) {
            console.log(`   🔍 First item keys: ${Object.keys(data[0]).join(', ')}`);
            
            // Check for pricing/duration in resources
            if (data[0].price !== undefined || data[0].duration !== undefined) {
              console.log(`   💰 PRICING FOUND!`);
              data.forEach((item, index) => {
                if (item.name) {
                  console.log(`      ${index + 1}. ${item.name}`);
                  console.log(`         Price: ${item.price || 'Not set'}`);
                  console.log(`         Duration: ${item.duration || 'Not set'}`);
                  console.log(`         Cost: ${item.cost || 'Not set'}`);
                  console.log(`         Length: ${item.length || 'Not set'}`);
                }
              });
            }
          }
        } else if (typeof data === 'object') {
          console.log(`   🔍 Object keys: ${Object.keys(data).join(', ')}`);
          
          // Check for nested pricing data
          if (data.resources) {
            console.log(`   📋 Found resources array: ${data.resources.length} items`);
          }
          if (data.services) {
            console.log(`   📋 Found services array: ${data.services.length} items`);
          }
          if (data.price || data.duration) {
            console.log(`   💰 Price: ${data.price}, Duration: ${data.duration}`);
          }
        }
        
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Error: ${errorText.substring(0, 100)}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Connection error: ${error.message}`);
    }
  }
  
  // Try to get detailed booking info to reverse-engineer pricing
  console.log('\n🔍 ANALYZING BOOKING DATA FOR PRICING');
  console.log('====================================');
  
  try {
    const bookingsResponse = await fetch(`${BASE_URL}/bookings.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}&limit=10`);
    if (bookingsResponse.ok) {
      const bookings = await bookingsResponse.json();
      console.log(`Found ${bookings.length} bookings to analyze:`);
      
      bookings.forEach((booking, index) => {
        console.log(`\n${index + 1}. ${booking.full_name || 'No name'}`);
        console.log(`   Service: ${booking.resource_name || 'No service'}`);
        console.log(`   Resource ID: ${booking.resource_id || 'No ID'}`);
        console.log(`   Start: ${booking.start || 'No time'}`);
        console.log(`   End: ${booking.finish || 'No end time'}`);
        console.log(`   Price: ${booking.price || 'No price'}`);
        console.log(`   Cost: ${booking.cost || 'No cost'}`);
        console.log(`   Fee: ${booking.fee || 'No fee'}`);
        console.log(`   Status: ${booking.status || 'No status'}`);
        
        // Calculate duration if start/end available
        if (booking.start && booking.finish) {
          const start = new Date(booking.start);
          const end = new Date(booking.finish);
          const duration = (end - start) / (1000 * 60); // minutes
          console.log(`   Calculated Duration: ${duration} minutes`);
        }
      });
    }
  } catch (error) {
    console.log(`❌ Booking analysis failed: ${error.message}`);
  }
}

deepSuperSaaSResearch();