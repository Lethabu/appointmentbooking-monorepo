const https = require('https');
const querystring = require('querystring');

const API_KEY = '5ciPW7IzfQRQy1wqdTsH6g';
const SCHEDULE_ID = 'Instyle Hair Boutique'; // This might be the actual ID

// SuperSaaS API using query parameter authentication
function makeRequest(endpoint, params = {}) {
    return new Promise((resolve, reject) => {
        // Add API key to parameters
        const allParams = { ...params, api_key: API_KEY };
        const queryString = querystring.stringify(allParams);
        const path = `${endpoint}?${queryString}`;
        
        const options = {
            hostname: 'www.supersaas.com',
            path,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'InstyleHairBoutique/1.0'
            }
        };

        console.log(`📡 Requesting: https://www.supersaas.com${path}`);

        const req = https.request(options, (res) => {
            let data = '';
            
            console.log(`   Status: ${res.statusCode}`);
            
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const result = JSON.parse(data);
                        resolve({ success: true, data: result });
                    } catch (e) {
                        resolve({ success: true, data });
                    }
                } else {
                    console.log(`   Error: ${data}`);
                    resolve({ success: false, error: data, status: res.statusCode });
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   Request failed: ${error.message}`);
            resolve({ success: false, error: error.message });
        });

        req.end();
    });
}

async function exploreSupersaasData() {
    console.log('🔍 SuperSaaS Data Explorer - Final Attempt\n');
    console.log(`🔑 API Key: ${API_KEY}`);
    console.log(`📋 Schedule ID/Name: ${SCHEDULE_ID}\n`);

    // Test different endpoint patterns
    const testEndpoints = [
        // Basic endpoints
        { path: '/api/schedules', desc: 'All Schedules' },
        { path: '/api/account', desc: 'Account Info' },
        
        // Schedule-specific endpoints (try both as ID and name)
        { path: `/api/schedules/${encodeURIComponent(SCHEDULE_ID)}`, desc: 'Schedule by Name' },
        { path: `/api/schedules/${SCHEDULE_ID}`, desc: 'Schedule Direct' },
        
        // Appointments
        { path: `/api/schedules/${encodeURIComponent(SCHEDULE_ID)}/appointments`, desc: 'Appointments by Name' },
        { path: `/api/appointments`, desc: 'All Appointments' },
        
        // Users/Clients
        { path: `/api/schedules/${encodeURIComponent(SCHEDULE_ID)}/users`, desc: 'Users by Name' },
        { path: `/api/users`, desc: 'All Users' },
        
        // Resources (Services)
        { path: `/api/schedules/${encodeURIComponent(SCHEDULE_ID)}/resources`, desc: 'Resources by Name' },
        
        // Forms and Fields
        { path: `/api/schedules/${encodeURIComponent(SCHEDULE_ID)}/forms`, desc: 'Forms' },
        { path: `/api/schedules/${encodeURIComponent(SCHEDULE_ID)}/fields`, desc: 'Custom Fields' }
    ];

    let foundData = false;

    for (const endpoint of testEndpoints) {
        console.log(`\n📋 ${endpoint.desc}:`);
        const result = await makeRequest(endpoint.path);
        
        if (result.success && result.data) {
            console.log('✅ SUCCESS! Data found:');
            
            if (typeof result.data === 'object') {
                console.log(JSON.stringify(result.data, null, 2));
                foundData = true;
                
                // If this is schedules data, extract IDs for further exploration
                if (Array.isArray(result.data)) {
                    console.log('\n🔍 Found schedules, exploring each...');
                    for (const schedule of result.data) {
                        if (schedule.id) {
                            console.log(`\n📊 Exploring Schedule ID: ${schedule.id}`);
                            await exploreScheduleById(schedule.id);
                        }
                    }
                }
            } else {
                console.log('Raw data:', result.data);
            }
        } else {
            console.log(`❌ Failed: ${result.error || 'Unknown error'}`);
        }
    }

    // Try numeric IDs if string-based failed
    if (!foundData) {
        console.log('\n🔢 Trying numeric schedule IDs...');
        for (let i = 1; i <= 10; i++) {
            console.log(`\n📋 Testing Schedule ID: ${i}`);
            const result = await makeRequest(`/api/schedules/${i}`);
            
            if (result.success && result.data) {
                console.log('✅ Found schedule with numeric ID!');
                console.log(JSON.stringify(result.data, null, 2));
                await exploreScheduleById(i);
                foundData = true;
                break;
            }
        }
    }

    return foundData;
}

async function exploreScheduleById(scheduleId) {
    const endpoints = [
        { path: `/api/schedules/${scheduleId}/appointments`, desc: 'Appointments' },
        { path: `/api/schedules/${scheduleId}/users`, desc: 'Users/Clients' },
        { path: `/api/schedules/${scheduleId}/resources`, desc: 'Resources/Services' },
        { path: `/api/schedules/${scheduleId}/slots`, desc: 'Available Slots' },
        { path: `/api/schedules/${scheduleId}/forms`, desc: 'Booking Forms' },
        { path: `/api/schedules/${scheduleId}/fields`, desc: 'Custom Fields' }
    ];

    for (const endpoint of endpoints) {
        console.log(`\n   📋 ${endpoint.desc}:`);
        const result = await makeRequest(endpoint.path);
        
        if (result.success && result.data) {
            console.log('   ✅ Data found:');
            if (typeof result.data === 'object') {
                console.log(JSON.stringify(result.data, null, 2));
            } else {
                console.log('   Raw:', result.data);
            }
        }
    }
}

// Run exploration
exploreSupersaasData().then((foundData) => {
    console.log('\n🎉 Exploration Complete!');
    
    if (!foundData) {
        console.log('\n💡 Troubleshooting suggestions:');
        console.log('1. Verify API key is correct in SuperSaaS dashboard');
        console.log('2. Check API key permissions (should have read access)');
        console.log('3. Confirm schedule name/ID is exact match');
        console.log('4. Try logging into SuperSaaS web interface to verify data exists');
        console.log('5. Check if account is active and not suspended');
    } else {
        console.log('\n✅ Data successfully retrieved! Check output above.');
    }
}).catch(error => {
    console.error('❌ Fatal error:', error);
});