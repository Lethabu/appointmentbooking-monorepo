#!/usr/bin/env node

const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const ACCOUNT = 'InStyle_Hair_Boutique';
const SCHEDULE_ID = '695384';
const BASE_URL = 'https://www.supersaas.com/api';

async function extractCompleteServiceData() {
  console.log('💎 EXTRACTING COMPLETE SERVICE DATA');
  console.log('===================================\n');
  
  try {
    // Get all bookings to analyze pricing patterns
    console.log('📊 Analyzing all bookings for service patterns...');
    const bookingsResponse = await fetch(`${BASE_URL}/bookings.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}&limit=50`);
    
    if (bookingsResponse.ok) {
      const bookings = await bookingsResponse.json();
      console.log(`Found ${bookings.length} bookings to analyze\n`);
      
      // Group by service and price
      const serviceMap = new Map();
      
      bookings.forEach(booking => {
        const serviceName = booking.service_name || booking.resource_name || 'Unknown Service';
        const price = booking.price || 0;
        const start = new Date(booking.start);
        const end = new Date(booking.finish);
        const duration = booking.finish ? (end - start) / (1000 * 60) : 60; // minutes
        
        const key = `${serviceName}_${price}`;
        if (!serviceMap.has(key)) {
          serviceMap.set(key, {
            name: serviceName,
            price: price,
            duration: duration,
            count: 0,
            bookings: []
          });
        }
        
        const service = serviceMap.get(key);
        service.count++;
        service.bookings.push({
          client: booking.full_name,
          date: booking.start,
          duration: duration
        });
      });
      
      console.log('🎯 SERVICE ANALYSIS RESULTS');
      console.log('===========================');
      
      Array.from(serviceMap.values()).forEach((service, index) => {
        console.log(`\n${index + 1}. ${service.name}`);
        console.log(`   Price: R${service.price / 100} (${service.price} cents)`);
        console.log(`   Duration: ${service.duration} minutes`);
        console.log(`   Bookings: ${service.count}`);
        console.log(`   Recent clients: ${service.bookings.slice(0, 3).map(b => b.client).join(', ')}`);
      });
      
      // Get resources for service IDs
      console.log('\n\n📋 RESOURCE/SERVICE MAPPING');
      console.log('===========================');
      
      const resourcesResponse = await fetch(`${BASE_URL}/resources.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}`);
      if (resourcesResponse.ok) {
        const resources = await resourcesResponse.json();
        console.log(`Found ${resources.length} resources:`);
        
        resources.forEach((resource, index) => {
          console.log(`\n${index + 1}. ${resource.name} (ID: ${resource.id})`);
          
          // Find matching bookings for this resource
          const matchingBookings = bookings.filter(b => 
            b.service_name === resource.name || 
            b.resource_name === resource.name ||
            b.service_id === resource.id
          );
          
          if (matchingBookings.length > 0) {
            const prices = [...new Set(matchingBookings.map(b => b.price))];
            const durations = [...new Set(matchingBookings.map(b => {
              if (b.finish) {
                const start = new Date(b.start);
                const end = new Date(b.finish);
                return (end - start) / (1000 * 60);
              }
              return 60;
            }))];
            
            console.log(`   Actual Price: R${prices[0] / 100} (${prices[0]} cents)`);
            console.log(`   Actual Duration: ${durations[0]} minutes`);
            console.log(`   Bookings: ${matchingBookings.length}`);
          } else {
            console.log(`   ⚠️  No matching bookings found`);
          }
        });
      }
      
      // Generate corrected database migration
      console.log('\n\n🔧 CORRECTED DATABASE MIGRATION');
      console.log('===============================');
      
      console.log('-- Update services with ACTUAL SuperSaaS data');
      console.log('DELETE FROM services WHERE tenant_id = \'ccb12b4d-ade6-467d-a614-7c9d198ddc70\';');
      console.log('');
      
      const uniqueServices = Array.from(serviceMap.values()).filter(s => s.name !== 'Unknown Service');
      uniqueServices.forEach(service => {
        const description = getServiceDescription(service.name);
        console.log(`INSERT INTO services (tenant_id, name, description, price, duration_minutes) VALUES`);
        console.log(`('ccb12b4d-ade6-467d-a614-7c9d198ddc70', '${service.name}', '${description}', ${service.price}, ${Math.round(service.duration)});`);
      });
      
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function getServiceDescription(serviceName) {
  const descriptions = {
    'Middle & Side Installation': 'Professional hair installation service for middle and side parts',
    'Maphondo & Lines Installation': 'Traditional African hairstyling with intricate patterns',
    'Soft Glam Makeup': 'Professional makeup application service',
    'Gel Maphondo Styling': 'Gel-based traditional styling service',
    'Frontal Ponytail Installation': 'Premium frontal ponytail installation service'
  };
  return descriptions[serviceName] || 'Professional hair service';
}

extractCompleteServiceData();