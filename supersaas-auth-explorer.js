const https = require('https');

const API_KEY = '5ciPW7IzfQRQy1wqdTsH6g';
const SCHEDULE_NAME = 'Instyle Hair Boutique';

// SuperSaaS uses Basic Auth with API key as username
function makeAuthenticatedRequest(path) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${API_KEY}:`).toString('base64');
        
        const options = {
            hostname: 'www.supersaas.com',
            path,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json',
                'User-Agent': 'InstyleHairBoutique/1.0'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            console.log(`📡 ${path} - Status: ${res.statusCode}`);
            
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode === 200) {
                        const result = JSON.parse(data);
                        resolve(result);
                    } else {
                        console.log(`❌ Error ${res.statusCode}: ${data}`);
                        resolve(null);
                    }
                } catch (e) {
                    // Return raw data if not JSON
                    resolve(data);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`❌ Request error for ${path}:`, error.message);
            resolve(null);
        });

        req.end();
    });
}

async function comprehensiveExploration() {
    console.log('🚀 SuperSaaS Comprehensive Data Explorer\n');
    console.log(`🔑 Using API Key: ${API_KEY.substring(0, 8)}...`);
    console.log(`🎯 Target Schedule: ${SCHEDULE_NAME}\n`);

    // Try multiple API endpoints and authentication methods
    const endpoints = [
        '/api/schedules.json',
        '/api/schedules',
        '/schedules.json',
        '/schedules',
        '/api/account.json',
        '/account.json'
    ];

    console.log('🔍 Testing API endpoints...\n');
    
    for (const endpoint of endpoints) {
        console.log(`\n📋 Testing: ${endpoint}`);
        const result = await makeAuthenticatedRequest(endpoint);
        
        if (result && typeof result === 'object') {
            console.log('✅ Success! Data found:');
            console.log(JSON.stringify(result, null, 2));
            
            // If we found schedules, explore further
            if (Array.isArray(result)) {
                await exploreScheduleData(result);
            } else if (result.schedules) {
                await exploreScheduleData(result.schedules);
            }
            break;
        } else if (result) {
            console.log('📄 Raw response:', result);
        }
    }

    // Try direct schedule access if we know the ID/name
    console.log('\n🎯 Trying direct schedule access...');
    await tryDirectScheduleAccess();
}

async function exploreScheduleData(schedules) {
    console.log(`\n📊 Found ${schedules.length} schedule(s)`);
    
    for (const schedule of schedules) {
        console.log(`\n🏢 Schedule: ${schedule.name || schedule.title || 'Unnamed'}`);
        console.log(`   ID: ${schedule.id}`);
        console.log(`   Description: ${schedule.description || 'N/A'}`);
        
        if (schedule.name?.toLowerCase().includes('instyle') || 
            schedule.name?.toLowerCase().includes('hair')) {
            
            console.log('🎯 Found target schedule! Exploring details...');
            await exploreScheduleDetails(schedule.id);
        }
    }
}

async function exploreScheduleDetails(scheduleId) {
    const detailEndpoints = [
        `/api/schedules/${scheduleId}.json`,
        `/api/schedules/${scheduleId}/appointments.json`,
        `/api/schedules/${scheduleId}/users.json`,
        `/api/schedules/${scheduleId}/resources.json`,
        `/api/schedules/${scheduleId}/slots.json`,
        `/api/schedules/${scheduleId}/forms.json`,
        `/api/schedules/${scheduleId}/fields.json`
    ];

    for (const endpoint of detailEndpoints) {
        console.log(`\n📋 Fetching: ${endpoint}`);
        const result = await makeAuthenticatedRequest(endpoint);
        
        if (result && typeof result === 'object') {
            console.log('✅ Data retrieved:');
            console.log(JSON.stringify(result, null, 2));
        }
    }
}

async function tryDirectScheduleAccess() {
    // Try different ways to access the schedule
    const directAttempts = [
        `/api/schedules/instyle-hair-boutique.json`,
        `/api/schedules/Instyle%20Hair%20Boutique.json`,
        `/api/schedules?name=Instyle Hair Boutique`,
        `/api/appointments.json`,
        `/api/users.json`
    ];

    for (const attempt of directAttempts) {
        console.log(`\n🔍 Direct attempt: ${attempt}`);
        const result = await makeAuthenticatedRequest(attempt);
        
        if (result && typeof result === 'object') {
            console.log('✅ Direct access successful:');
            console.log(JSON.stringify(result, null, 2));
        }
    }
}

// Run the exploration
comprehensiveExploration().then(() => {
    console.log('\n🎉 Exploration completed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Check if any endpoints returned data');
    console.log('   2. Verify API key permissions in SuperSaaS dashboard');
    console.log('   3. Check if schedule name matches exactly');
}).catch(error => {
    console.error('❌ Fatal error:', error);
});