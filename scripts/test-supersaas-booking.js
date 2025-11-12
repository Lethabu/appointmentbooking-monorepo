#!/usr/bin/env node

const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const ACCOUNT = 'InStyle_Hair_Boutique';
const SCHEDULE_ID = '695384';
const BASE_URL = 'https://www.supersaas.com/api';

async function testBookingCreation() {
  console.log('🧪 TESTING SUPERSAAS BOOKING CREATION');
  console.log('====================================\n');
  
  try {
    // Test booking data
    const testBooking = {
      schedule_id: SCHEDULE_ID,
      user_name: 'Test User',
      user_email: 'test@example.com',
      start: '2024-12-25T10:00:00',
      finish: '2024-12-25T11:00:00',
      resource_id: '302873', // Middle & Side Installation
      description: 'Test booking from API'
    };
    
    console.log('📝 Creating test booking...');
    console.log(`Service: Middle & Side Installation (ID: 302873)`);
    console.log(`Time: ${testBooking.start} - ${testBooking.finish}`);
    console.log(`Client: ${testBooking.user_name} (${testBooking.user_email})`);
    
    const bookingResponse = await fetch(`${BASE_URL}/bookings.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...testBooking,
        account: ACCOUNT,
        api_key: API_KEY
      })
    });
    
    console.log(`\nResponse: ${bookingResponse.status} ${bookingResponse.statusText}`);
    
    if (bookingResponse.ok) {
      const result = await bookingResponse.json();
      console.log('✅ Booking created successfully!');
      console.log(`Booking ID: ${result.id || 'Unknown'}`);
      
      // Verify booking exists
      console.log('\n🔍 Verifying booking exists...');
      const verifyResponse = await fetch(`${BASE_URL}/bookings.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}&limit=5`);
      
      if (verifyResponse.ok) {
        const bookings = await verifyResponse.json();
        const testBookingFound = bookings.find(b => b.user_email === 'test@example.com');
        
        if (testBookingFound) {
          console.log('✅ Test booking found in SuperSaaS');
          console.log(`   Client: ${testBookingFound.full_name}`);
          console.log(`   Time: ${testBookingFound.start}`);
          console.log(`   Price: R${testBookingFound.price / 100}`);
        } else {
          console.log('⚠️  Test booking not found in recent bookings');
        }
      }
      
    } else {
      const errorText = await bookingResponse.text();
      console.log('❌ Booking creation failed');
      console.log(`Error: ${errorText.substring(0, 200)}`);
    }
    
    console.log('\n🔄 WEBSITE BOOKING TEST');
    console.log('======================');
    
    // Test website booking creation
    const websiteBooking = {
      tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
      name: 'Website Test User',
      email: 'websitetest@example.com',
      phone: '+27123456789',
      serviceId: 'test-service-id',
      scheduledTime: '2024-12-25T14:00:00Z',
      notes: 'Test booking from website'
    };
    
    console.log('📝 Testing website booking API...');
    const websiteResponse = await fetch('https://www.instylehairboutique.co.za/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(websiteBooking)
    });
    
    console.log(`Response: ${websiteResponse.status} ${websiteResponse.statusText}`);
    
    if (websiteResponse.ok) {
      const result = await websiteResponse.json();
      console.log('✅ Website booking API working');
      console.log(`Success: ${result.success}`);
      console.log(`Message: ${result.message}`);
    } else {
      const errorText = await websiteResponse.text();
      console.log('❌ Website booking failed');
      console.log(`Error: ${errorText.substring(0, 200)}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBookingCreation();