#!/usr/bin/env node

const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const ACCOUNT = 'InStyle_Hair_Boutique';
const SCHEDULE_ID = '695384';
const BASE_URL = 'https://www.supersaas.com/api';

async function getCompleteServiceData() {
  console.log('🔄 SYNCING ALL 5 SUPERSAAS SERVICES TO PLATFORM');
  console.log('===============================================\n');
  
  try {
    // Get all resources
    const resourcesResponse = await fetch(`${BASE_URL}/resources.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}`);
    const resources = await resourcesResponse.json();
    
    // Get all bookings for pricing analysis
    const bookingsResponse = await fetch(`${BASE_URL}/bookings.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}&limit=100`);
    const bookings = await bookingsResponse.json();
    
    console.log(`📋 Found ${resources.length} services in SuperSaaS`);
    console.log(`📊 Analyzing ${bookings.length} bookings for pricing\n`);
    
    const serviceData = [];
    
    // Process each service
    resources.forEach(resource => {
      console.log(`🔍 Processing: ${resource.name} (ID: ${resource.id})`);
      
      // Find bookings for this service
      const serviceBookings = bookings.filter(b => 
        b.service_id === resource.id || 
        b.service_name === resource.name ||
        b.resource_name === resource.name
      );
      
      let price = 0;
      let duration = 60; // default
      
      if (serviceBookings.length > 0) {
        // Get price from bookings
        const prices = serviceBookings.map(b => b.price).filter(p => p > 0);
        price = prices.length > 0 ? prices[0] : 0;
        
        // Calculate duration from booking times
        const durations = serviceBookings.map(b => {
          if (b.start && b.finish) {
            const start = new Date(b.start);
            const end = new Date(b.finish);
            return (end - start) / (1000 * 60);
          }
          return 60;
        }).filter(d => d > 0);
        
        duration = durations.length > 0 ? durations[0] : 60;
        
        console.log(`   ✅ Found ${serviceBookings.length} bookings`);
        console.log(`   💰 Price: R${price / 100} (${price} cents)`);
        console.log(`   ⏱️  Duration: ${duration} minutes`);
      } else {
        // No bookings - estimate pricing based on service name
        price = estimateServicePrice(resource.name);
        duration = estimateServiceDuration(resource.name);
        
        console.log(`   ⚠️  No bookings found - using estimates`);
        console.log(`   💰 Estimated Price: R${price / 100} (${price} cents)`);
        console.log(`   ⏱️  Estimated Duration: ${duration} minutes`);
      }
      
      serviceData.push({
        id: resource.id,
        name: resource.name,
        price: price,
        duration: Math.round(duration),
        bookings: serviceBookings.length
      });
      
      console.log('');
    });
    
    // Generate database migration
    console.log('🔧 COMPLETE DATABASE MIGRATION');
    console.log('==============================');
    console.log('-- Sync ALL 5 SuperSaaS services to platform');
    console.log("DELETE FROM services WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';");
    console.log('');
    
    serviceData.forEach(service => {
      const description = getServiceDescription(service.name);
      console.log(`INSERT INTO services (tenant_id, name, description, price, duration_minutes) VALUES`);
      console.log(`('ccb12b4d-ade6-467d-a614-7c9d198ddc70', '${service.name}', '${description}', ${service.price}, ${service.duration});`);
    });
    
    console.log('\n📊 SYNC SUMMARY');
    console.log('===============');
    serviceData.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   Price: R${service.price / 100} | Duration: ${service.duration}min | Bookings: ${service.bookings}`);
    });
    
    console.log('\n✅ ALL 5 SERVICES READY FOR PLATFORM SYNC');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function estimateServicePrice(serviceName) {
  const estimates = {
    'Middle & Side Installation': 30000, // R300
    'Maphondo & Lines Installation': 35000, // R350
    'Soft Glam Makeup': 45000, // R450
    'Gel Maphondo Styling': 35000, // R350
    'Frontal Ponytail Installation': 95000 // R950
  };
  return estimates[serviceName] || 30000;
}

function estimateServiceDuration(serviceName) {
  const estimates = {
    'Middle & Side Installation': 60,
    'Maphondo & Lines Installation': 60,
    'Soft Glam Makeup': 120,
    'Gel Maphondo Styling': 120,
    'Frontal Ponytail Installation': 120
  };
  return estimates[serviceName] || 60;
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

getCompleteServiceData();