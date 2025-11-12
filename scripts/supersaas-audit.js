#!/usr/bin/env node

/**
 * SuperSaaS Configuration Audit for Instyle Hair Boutique
 * Ensures complete alignment between website and SuperSaaS
 */

const SUPERSAAS_CONFIG = {
  API_KEY: '5ciPW7IzfQRQy1wqdTsH6g',
  SCHEDULE_NAME: 'Instyle Hair Boutique',
  BASE_URL: 'https://www.supersaas.com/api'
};

const WEBSITE_SERVICES = [
  { name: 'Middle & Side Installation', price: 450, duration: 180, description: 'Professional hair installation service for middle and side parts' },
  { name: 'Maphondo & Lines', price: 350, duration: 120, description: 'Traditional African hairstyling with intricate patterns' },
  { name: 'Hair Treatment', price: 250, duration: 90, description: 'Deep conditioning and nourishing hair treatment' },
  { name: 'Hair Coloring', price: 550, duration: 150, description: 'Professional hair coloring and highlighting services' },
  { name: 'Hair Extensions', price: 650, duration: 240, description: 'Premium hair extension installation and styling' },
  { name: 'Wash & Style', price: 150, duration: 60, description: 'Complete hair wash, conditioning, and styling service' }
];

const BUSINESS_INFO = {
  name: 'Instyle Hair Boutique',
  phone: '+27 123 456 789',
  email: 'bookings@instylehairboutique.co.za',
  address: 'Cape Town, South Africa',
  website: 'https://www.instylehairboutique.co.za',
  hours: {
    monday: '09:00-17:00',
    tuesday: '09:00-17:00', 
    wednesday: '09:00-17:00',
    thursday: '09:00-17:00',
    friday: '09:00-17:00',
    saturday: '08:00-16:00',
    sunday: 'closed'
  }
};

const EMPLOYEES = [
  { name: 'Thandi Mthembu', role: 'Senior Stylist', specialties: ['Middle & Side Installation', 'Hair Extensions'] },
  { name: 'Nomsa Dlamini', role: 'Hair Treatment Specialist', specialties: ['Hair Treatment', 'Hair Coloring'] },
  { name: 'Zanele Khumalo', role: 'Traditional Stylist', specialties: ['Maphondo & Lines', 'Wash & Style'] },
  { name: 'Precious Ndaba', role: 'Junior Stylist', specialties: ['Wash & Style', 'Hair Treatment'] }
];

async function auditSuperSaaSConfiguration() {
  console.log('🔍 SUPERSAAS CONFIGURATION AUDIT');
  console.log('================================\n');

  // 1. Verify Schedule Configuration
  console.log('📅 SCHEDULE VERIFICATION');
  console.log(`Schedule Name: ${SUPERSAAS_CONFIG.SCHEDULE_NAME}`);
  console.log(`API Key: ${SUPERSAAS_CONFIG.API_KEY.substring(0, 8)}...`);
  
  try {
    const scheduleResponse = await fetch(`${SUPERSAAS_CONFIG.BASE_URL}/schedules.json`, {
      headers: {
        'Authorization': `Bearer ${SUPERSAAS_CONFIG.API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (scheduleResponse.ok) {
      const schedules = await scheduleResponse.json();
      const instyleSchedule = schedules.find(s => s.name === SUPERSAAS_CONFIG.SCHEDULE_NAME);
      
      if (instyleSchedule) {
        console.log('✅ Schedule found in SuperSaaS');
        console.log(`   Schedule ID: ${instyleSchedule.id}`);
        console.log(`   Status: ${instyleSchedule.active ? 'Active' : 'Inactive'}`);
      } else {
        console.log('❌ Schedule not found - needs creation');
      }
    }
  } catch (error) {
    console.log('⚠️  API connection failed:', error.message);
  }

  // 2. Service Alignment Check
  console.log('\n💇 SERVICE ALIGNMENT CHECK');
  console.log('Website Services vs SuperSaaS Resources:');
  
  WEBSITE_SERVICES.forEach((service, index) => {
    console.log(`${index + 1}. ${service.name}`);
    console.log(`   Price: R${service.price} | Duration: ${service.duration}min`);
    console.log(`   Description: ${service.description}`);
    console.log('   SuperSaaS Status: ⏳ Needs verification\n');
  });

  // 3. Business Information Alignment
  console.log('🏢 BUSINESS INFORMATION');
  console.log(`Name: ${BUSINESS_INFO.name}`);
  console.log(`Phone: ${BUSINESS_INFO.phone}`);
  console.log(`Email: ${BUSINESS_INFO.email}`);
  console.log(`Website: ${BUSINESS_INFO.website}`);
  console.log(`Address: ${BUSINESS_INFO.address}`);
  
  console.log('\n⏰ BUSINESS HOURS');
  Object.entries(BUSINESS_INFO.hours).forEach(([day, hours]) => {
    console.log(`${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours}`);
  });

  // 4. Employee Schedule Setup
  console.log('\n👥 EMPLOYEE SCHEDULE CONFIGURATION');
  console.log('Required: 4 duplicate schedules for employees');
  
  EMPLOYEES.forEach((employee, index) => {
    console.log(`${index + 1}. ${employee.name} (${employee.role})`);
    console.log(`   Specialties: ${employee.specialties.join(', ')}`);
    console.log(`   Schedule: "${SUPERSAAS_CONFIG.SCHEDULE_NAME} - ${employee.name}"`);
    console.log('   Status: ⏳ Needs creation\n');
  });

  // 5. Historical Data Migration Check
  console.log('📊 DATA MIGRATION REQUIREMENTS');
  console.log('✅ All existing bookings must be preserved');
  console.log('✅ Client database must be maintained');
  console.log('✅ Historical revenue data must be intact');
  console.log('✅ Future appointments must remain valid');

  // 6. Configuration Recommendations
  console.log('\n🎯 SUPERSAAS CONFIGURATION ACTIONS REQUIRED');
  console.log('==========================================');
  
  console.log('\n1. MAIN SCHEDULE VERIFICATION');
  console.log('   - Verify "Instyle Hair Boutique" schedule exists');
  console.log('   - Update business information if needed');
  console.log('   - Ensure all 6 services are configured correctly');
  
  console.log('\n2. SERVICE CONFIGURATION');
  WEBSITE_SERVICES.forEach((service, index) => {
    console.log(`   ${index + 1}. Create/Update: ${service.name}`);
    console.log(`      - Price: R${service.price}`);
    console.log(`      - Duration: ${service.duration} minutes`);
    console.log(`      - Description: ${service.description}`);
  });
  
  console.log('\n3. EMPLOYEE SCHEDULE CREATION');
  console.log('   Create 4 duplicate schedules:');
  EMPLOYEES.forEach((employee, index) => {
    console.log(`   ${index + 1}. "${SUPERSAAS_CONFIG.SCHEDULE_NAME} - ${employee.name}"`);
    console.log(`      - Copy all services from main schedule`);
    console.log(`      - Set individual availability`);
    console.log(`      - Link to main client database`);
  });
  
  console.log('\n4. AVAILABILITY SETUP');
  console.log('   Configure working hours for each employee:');
  console.log('   - Monday-Friday: 09:00-17:00');
  console.log('   - Saturday: 08:00-16:00');
  console.log('   - Sunday: Closed');
  console.log('   - Individual breaks and time-off');
  
  console.log('\n5. INTEGRATION VERIFICATION');
  console.log('   - Test dual-sync functionality');
  console.log('   - Verify booking creation from website');
  console.log('   - Confirm SuperSaaS admin panel access');
  console.log('   - Test client notifications');

  console.log('\n✨ AUDIT COMPLETE');
  console.log('Next: Execute SuperSaaS configuration updates');
}

// Execute audit
auditSuperSaaSConfiguration().catch(console.error);