#!/usr/bin/env node

const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const ACCOUNT = 'InStyle_Hair_Boutique';
const MAIN_SCHEDULE_ID = '695384';
const BASE_URL = 'https://www.supersaas.com/api';

const EMPLOYEES = [
  { name: 'Thandi Mthembu', role: 'Senior Stylist' },
  { name: 'Nomsa Dlamini', role: 'Hair Treatment Specialist' },
  { name: 'Zanele Khumalo', role: 'Traditional Stylist' },
  { name: 'Precious Ndaba', role: 'Junior Stylist' }
];

async function createEmployeeSchedules() {
  console.log('🔄 SUPERSAAS EMPLOYEE SCHEDULE DUPLICATION');
  console.log('==========================================\n');
  
  try {
    // First, verify main schedule and services
    console.log('📋 Verifying main schedule...');
    const resourcesResponse = await fetch(`${BASE_URL}/resources.json?schedule_id=${MAIN_SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}`);
    const resources = await resourcesResponse.json();
    
    console.log(`✅ Main schedule has ${resources.length} services:`);
    resources.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} (ID: ${service.id})`);
    });
    
    console.log('\n🎯 EMPLOYEE SCHEDULE CREATION PLAN');
    console.log('==================================');
    
    EMPLOYEES.forEach((employee, index) => {
      console.log(`\n${index + 1}. ${employee.name} (${employee.role})`);
      console.log(`   Schedule Name: "Instyle Hair Boutique - ${employee.name}"`);
      console.log(`   Services: All ${resources.length} services copied`);
      console.log(`   Status: ⏳ Manual duplication required`);
    });
    
    console.log('\n📋 MANUAL DUPLICATION STEPS');
    console.log('===========================');
    console.log('1. Login: https://www.supersaas.com/login');
    console.log('2. Navigate to "Instyle Hair Boutique" schedule');
    console.log('3. Go to Settings → Duplicate Schedule');
    console.log('4. Create 4 copies with these names:');
    
    EMPLOYEES.forEach((employee, index) => {
      console.log(`   ${index + 1}. "Instyle Hair Boutique - ${employee.name}"`);
    });
    
    console.log('\n5. For each employee schedule:');
    console.log('   ✅ Verify all 5 services copied');
    console.log('   ✅ Check pricing matches main schedule');
    console.log('   ✅ Set individual availability hours');
    console.log('   ✅ Enable shared client database');
    
    console.log('\n📊 EXPECTED RESULT');
    console.log('==================');
    console.log('• 5 total schedules (1 main + 4 employees)');
    console.log('• 25 total services (5 services × 5 schedules)');
    console.log('• Identical pricing across all schedules');
    console.log('• Individual employee availability');
    console.log('• Shared client database (75+ users)');
    
    console.log('\n✅ READY FOR MANUAL EXECUTION');
    console.log('Execute the manual steps above to complete the setup!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createEmployeeSchedules();