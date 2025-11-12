const https = require('https');

const API_KEY = '5ciPW7IzfQRQy1wqdTsH6g';
const BASE_URL = 'https://www.supersaas.com/api';

// Make API request
function makeRequest(endpoint, method = 'GET') {
    return new Promise((resolve, reject) => {
        const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (e) {
                    resolve(data); // Return raw data if not JSON
                }
            });
        }).on('error', reject);
    });
}

async function exploreAllEndpoints() {
    console.log('🔍 SuperSaaS API Explorer - Comprehensive Tenant Analysis\n');
    
    try {
        // 1. Get all schedules first
        console.log('📅 SCHEDULES:');
        const schedules = await makeRequest('/schedules');
        console.log(JSON.stringify(schedules, null, 2));
        
        if (!schedules || schedules.length === 0) {
            console.log('No schedules found. Checking account info...');
            return;
        }

        // Get the first schedule ID (or find by name)
        let scheduleId = schedules[0]?.id;
        
        // Try to find "Instyle Hair Boutique" schedule
        const targetSchedule = schedules.find(s => 
            s.name?.toLowerCase().includes('instyle') || 
            s.name?.toLowerCase().includes('hair') ||
            s.name?.toLowerCase().includes('boutique')
        );
        
        if (targetSchedule) {
            scheduleId = targetSchedule.id;
            console.log(`\n✅ Found target schedule: ${targetSchedule.name} (ID: ${scheduleId})`);
        }

        if (!scheduleId) {
            console.log('❌ No valid schedule ID found');
            return;
        }

        // 2. Get schedule configuration
        console.log(`\n⚙️  SCHEDULE CONFIGURATION (ID: ${scheduleId}):`);
        const config = await makeRequest(`/schedules/${scheduleId}`);
        console.log(JSON.stringify(config, null, 2));

        // 3. Get all appointments/bookings
        console.log(`\n📋 APPOINTMENTS/BOOKINGS:`);
        const appointments = await makeRequest(`/schedules/${scheduleId}/appointments`);
        console.log(JSON.stringify(appointments, null, 2));

        // 4. Get recent appointments (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        console.log(`\n📅 RECENT APPOINTMENTS (from ${fromDate}):`);
        const recentAppointments = await makeRequest(`/schedules/${scheduleId}/appointments?from=${fromDate}`);
        console.log(JSON.stringify(recentAppointments, null, 2));

        // 5. Get all users/clients
        console.log(`\n👥 USERS/CLIENTS:`);
        const users = await makeRequest(`/schedules/${scheduleId}/users`);
        console.log(JSON.stringify(users, null, 2));

        // 6. Get resources (services/staff)
        console.log(`\n🛠️  RESOURCES (Services/Staff):`);
        const resources = await makeRequest(`/schedules/${scheduleId}/resources`);
        console.log(JSON.stringify(resources, null, 2));

        // 7. Get slots/availability
        console.log(`\n🕐 AVAILABLE SLOTS:`);
        const slots = await makeRequest(`/schedules/${scheduleId}/slots`);
        console.log(JSON.stringify(slots, null, 2));

        // 8. Get forms (booking forms)
        console.log(`\n📝 FORMS:`);
        const forms = await makeRequest(`/schedules/${scheduleId}/forms`);
        console.log(JSON.stringify(forms, null, 2));

        // 9. Get account info
        console.log(`\n🏢 ACCOUNT INFO:`);
        const account = await makeRequest('/account');
        console.log(JSON.stringify(account, null, 2));

        // 10. Try alternative schedule lookup by name
        console.log(`\n🔍 SCHEDULE SEARCH BY NAME:`);
        const scheduleByName = await makeRequest('/schedules?name=Instyle Hair Boutique');
        console.log(JSON.stringify(scheduleByName, null, 2));

        // 11. Get field definitions
        console.log(`\n📊 FIELD DEFINITIONS:`);
        const fields = await makeRequest(`/schedules/${scheduleId}/fields`);
        console.log(JSON.stringify(fields, null, 2));

        // 12. Get pricing/packages
        console.log(`\n💰 PRICING/PACKAGES:`);
        const packages = await makeRequest(`/schedules/${scheduleId}/packages`);
        console.log(JSON.stringify(packages, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        // Try basic endpoints if main exploration fails
        console.log('\n🔄 Trying basic endpoints...');
        
        try {
            const basicSchedules = await makeRequest('/schedules.json');
            console.log('Basic schedules:', JSON.stringify(basicSchedules, null, 2));
        } catch (e) {
            console.log('Basic schedules failed:', e.message);
        }
    }
}

// Run the exploration
exploreAllEndpoints().then(() => {
    console.log('\n✅ Exploration complete!');
}).catch(error => {
    console.error('❌ Fatal error:', error);
});