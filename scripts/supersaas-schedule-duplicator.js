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

async function apiCall(endpoint, method = 'GET', data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function duplicateScheduleForEmployee(employee) {
  console.log(`\n🔄 Creating schedule for ${employee.name}...`);
  
  try {
    // Create new schedule (SuperSaaS API endpoint for duplication)
    const scheduleData = {
      name: `Instyle Hair Boutique - ${employee.name}`,
      description: `Personal schedule for ${employee.name} (${employee.role})`,
      account: ACCOUNT,
      api_key: API_KEY,
      template_schedule_id: MAIN_SCHEDULE_ID
    };
    
    console.log(`   Schedule name: "${scheduleData.name}"`);
    console.log(`   Template: ${MAIN_SCHEDULE_ID}`);
    console.log(`   ⚠️  Manual duplication required - API creation not available`);
    
    return {
      success: false,
      message: 'Manual duplication required',
      scheduleName: scheduleData.name
    };
    
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function updateServicePricing() {
  console.log('\n💰 UPDATING SERVICE PRICING');
  console.log('============================');
  
  const services = [
    { id: '302873', name: 'Middle & Side Installation', price: 300, duration: 60 },
    { id: '302874', name: 'Maphondo & Lines Installation', price: 350, duration: 60 },
    { id: '337555', name: 'Soft Glam Makeup', price: 450, duration: 120 },
    { id: '337556', name: 'Gel Maphondo Styling', price: 350, duration: 120 },
    { id: '337557', name: 'Frontal Ponytail Installation', price: 950, duration: 120 }
  ];
  
  for (const service of services) {
    console.log(`\n📝 ${service.name}`);
    console.log(`   Price: R${service.price}`);
    console.log(`   Duration: ${service.duration} minutes`);
    console.log(`   ⚠️  Manual update required in SuperSaaS admin`);
  }
}

async function generateManualInstructions() {
  console.log('\n📋 MANUAL DUPLICATION INSTRUCTIONS');
  console.log('==================================');
  
  console.log('\n1. LOGIN TO SUPERSAAS');
  console.log('   URL: https://www.supersaas.com/login');
  console.log('   Account: InStyle_Hair_Boutique');
  
  console.log('\n2. ACTIVATE MAIN SCHEDULE');
  console.log('   - Find "Instyle Hair Boutique" schedule');
  console.log('   - Change status from "Inactive" to "Active"');
  
  console.log('\n3. UPDATE SERVICE PRICING');
  console.log('   Go to Schedule Settings → Resources/Services:');
  console.log('   - Middle & Side Installation: R300, 60min');
  console.log('   - Maphondo & Lines Installation: R350, 60min');
  console.log('   - Soft Glam Makeup: R450, 120min');
  console.log('   - Gel Maphondo Styling: R350, 120min');
  console.log('   - Frontal Ponytail Installation: R950, 120min');
  
  console.log('\n4. DUPLICATE SCHEDULE (4 times)');
  EMPLOYEES.forEach((employee, index) => {
    console.log(`   ${index + 1}. Duplicate → "Instyle Hair Boutique - ${employee.name}"`);
  });
  
  console.log('\n5. VERIFY EACH EMPLOYEE SCHEDULE');
  console.log('   - All 5 services copied with correct pricing');
  console.log('   - Individual availability hours set');
  console.log('   - Shared client database enabled');
}

async function main() {
  console.log('🚀 SUPERSAAS SCHEDULE DUPLICATION');
  console.log('=================================');
  
  try {
    // Check current status
    console.log('\n📊 CURRENT STATUS CHECK');
    const resourcesUrl = `/resources.json?schedule_id=${MAIN_SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}`;
    const resources = await apiCall(resourcesUrl);
    console.log(`✅ Main schedule accessible with ${resources.length} services`);
    
    // Update service pricing (manual instructions)
    await updateServicePricing();
    
    // Attempt employee schedule creation
    console.log('\n👥 EMPLOYEE SCHEDULE CREATION');
    console.log('=============================');
    
    for (const employee of EMPLOYEES) {
      await duplicateScheduleForEmployee(employee);
    }
    
    // Generate manual instructions
    await generateManualInstructions();
    
    console.log('\n✨ NEXT STEPS');
    console.log('=============');
    console.log('1. Complete manual SuperSaaS configuration');
    console.log('2. Test website booking integration');
    console.log('3. Verify dual-sync functionality');
    console.log('4. Train staff on new system');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();