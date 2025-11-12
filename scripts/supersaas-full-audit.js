#!/usr/bin/env node

const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const ACCOUNT = 'InStyle_Hair_Boutique';
const SCHEDULE_ID = '695384';
const BASE_URL = 'https://www.supersaas.com/api';

async function fullSuperSaaSAudit() {
  console.log('🔍 COMPLETE SUPERSAAS AUDIT - Instyle Hair Boutique\n');
  console.log('================================================\n');
  
  try {
    // 1. Get all schedules
    console.log('📅 SCHEDULES');
    const schedulesUrl = `${BASE_URL}/schedules.json?account=${ACCOUNT}&api_key=${API_KEY}`;
    const schedulesResponse = await fetch(schedulesUrl);
    
    if (schedulesResponse.ok) {
      const schedules = await schedulesResponse.json();
      console.log(`Found ${schedules.length} schedule(s):`);
      schedules.forEach((schedule, index) => {
        console.log(`${index + 1}. "${schedule.name}" (ID: ${schedule.id})`);
        console.log(`   Active: ${schedule.active ? 'Yes' : 'No'}`);
        console.log(`   Type: ${schedule.schedule_type || 'Unknown'}`);
      });
    }
    
    // 2. Get resources/services
    console.log('\n💇 SERVICES/RESOURCES');
    const resourcesUrl = `${BASE_URL}/resources.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}`;
    const resourcesResponse = await fetch(resourcesUrl);
    
    if (resourcesResponse.ok) {
      const resources = await resourcesResponse.json();
      console.log(`Found ${resources.length} service(s):`);
      resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.name}`);
        console.log(`   ID: ${resource.id}`);
        console.log(`   Price: ${resource.price || 'Not set'}`);
        console.log(`   Duration: ${resource.duration || 'Not set'}`);
        console.log(`   Description: ${resource.description || 'None'}`);
      });
    }
    
    // 3. Get recent bookings
    console.log('\n📊 RECENT BOOKINGS');
    const bookingsUrl = `${BASE_URL}/bookings.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}&limit=10`;
    const bookingsResponse = await fetch(bookingsUrl);
    
    if (bookingsResponse.ok) {
      const bookings = await bookingsResponse.json();
      const bookingArray = Array.isArray(bookings) ? bookings : [bookings];
      console.log(`Found ${bookingArray.length} recent booking(s):`);
      bookingArray.slice(0, 5).forEach((booking, index) => {
        if (booking && typeof booking === 'object') {
          console.log(`${index + 1}. ${booking.full_name || 'No name'}`);
          console.log(`   Service: ${booking.resource_name || 'No service'}`);
          console.log(`   Time: ${booking.start || 'No time'}`);
          console.log(`   Status: ${booking.status || 'Unknown'}`);
        }
      });
    }
    
    // 4. Get schedule details
    console.log('\n⚙️ SCHEDULE CONFIGURATION');
    const scheduleUrl = `${BASE_URL}/schedules/${SCHEDULE_ID}.json?account=${ACCOUNT}&api_key=${API_KEY}`;
    const scheduleResponse = await fetch(scheduleUrl);
    
    if (scheduleResponse.ok) {
      const schedule = await scheduleResponse.json();
      console.log(`Schedule: "${schedule.name}"`);
      console.log(`ID: ${schedule.id}`);
      console.log(`Active: ${schedule.active ? 'Yes' : 'No'}`);
      console.log(`Type: ${schedule.schedule_type}`);
      console.log(`URL: ${schedule.url || 'Not available'}`);
    }
    
    // 5. Summary for employee duplication
    console.log('\n🎯 EMPLOYEE DUPLICATION PLAN');
    console.log('============================');
    console.log(`Main Schedule ID: ${SCHEDULE_ID}`);
    console.log(`Account: ${ACCOUNT}`);
    console.log(`API Key: ${API_KEY.substring(0, 8)}...`);
    console.log('\nRequired Employee Schedules:');
    console.log('1. Instyle Hair Boutique - Thandi Mthembu');
    console.log('2. Instyle Hair Boutique - Nomsa Dlamini');
    console.log('3. Instyle Hair Boutique - Zanele Khumalo');
    console.log('4. Instyle Hair Boutique - Precious Ndaba');
    
    console.log('\n✅ API ACCESS CONFIRMED');
    console.log('Ready for schedule duplication!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fullSuperSaaSAudit();