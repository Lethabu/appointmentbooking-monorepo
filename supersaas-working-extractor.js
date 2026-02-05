const fs = require('fs');
const https = require('https');

// Working credentials from your successful API call
const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const ACCOUNT = 'InStyle_Hair_Boutique';
const SCHEDULE_ID = '695384';

function apiRequest(endpoint, params = {}) {
    return new Promise((resolve, reject) => {
        const allParams = {
            schedule_id: SCHEDULE_ID,
            account: ACCOUNT,
            api_key: API_KEY,
            ...params
        };
        
        const queryString = new URLSearchParams(allParams).toString();
        const url = `https://www.supersaas.com/api/${endpoint}?${queryString}`;
        
        console.log(`📡 ${url}`);
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`   Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    console.log(`   Error: ${data}`);
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
}

async function extractAllData() {
    console.log('🚀 Extracting Instyle Hair Boutique Data\n');
    
    const data = {};
    
    // 1. Resources/Services (we know this works)
    console.log('🛠️ Getting resources/services...');
    data.resources = await apiRequest('resources.json');
    
    // 2. Appointments
    console.log('\n📋 Getting appointments...');
    data.appointments = await apiRequest('appointments.json');
    
    // 3. Users/Clients
    console.log('\n👥 Getting users...');
    data.users = await apiRequest('users.json');
    
    // 4. Schedule info
    console.log('\n📅 Getting schedule...');
    data.schedule = await apiRequest('schedules.json');
    
    // 5. Slots
    console.log('\n🕐 Getting slots...');
    data.slots = await apiRequest('slots.json');
    
    // 6. Forms
    console.log('\n📝 Getting forms...');
    data.forms = await apiRequest('forms.json');
    
    // Save all data
    const filename = `instyle-data-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\n💾 Saved to: ${filename}`);
    
    // Show summary
    console.log('\n📊 SUMMARY:');
    Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            console.log(`${key}: ${value.length} items`);
        } else if (value) {
            console.log(`${key}: ✅`);
        } else {
            console.log(`${key}: ❌`);
        }
    });
    
    return data;
}

extractAllData().catch(console.error);