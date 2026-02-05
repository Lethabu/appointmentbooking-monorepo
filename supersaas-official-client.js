// Based on official SuperSaaS Node.js API client
// https://github.com/SuperSaaS/supersaas-nodejs-api-client

const https = require('https');
const querystring = require('querystring');

class SuperSaaSClient {
    constructor(accountName, apiKey) {
        this.accountName = accountName;
        this.apiKey = apiKey;
        this.host = 'www.supersaas.com';
        this.verbose = true;
    }

    // Make authenticated request to SuperSaaS API
    request(path, params = {}, method = 'GET') {
        return new Promise((resolve, reject) => {
            // Add authentication
            const allParams = {
                ...params,
                account: this.accountName,
                api_key: this.apiKey
            };

            let requestPath = path;
            let postData = null;

            if (method === 'GET') {
                const queryString = querystring.stringify(allParams);
                requestPath = `${path}?${queryString}`;
            } else {
                postData = querystring.stringify(allParams);
            }

            const options = {
                hostname: this.host,
                path: requestPath,
                method,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'SuperSaaS/NodeJS'
                }
            };

            if (postData) {
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                options.headers['Content-Length'] = Buffer.byteLength(postData);
            }

            if (this.verbose) {
                console.log(`📡 ${method} https://${this.host}${requestPath}`);
            }

            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (this.verbose) {
                        console.log(`   Status: ${res.statusCode}`);
                    }

                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const result = JSON.parse(data);
                            resolve(result);
                        } catch (e) {
                            resolve(data);
                        }
                    } else {
                        console.log(`❌ Error ${res.statusCode}: ${data}`);
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('error', reject);

            if (postData) {
                req.write(postData);
            }

            req.end();
        });
    }

    // Get all schedules
    async getSchedules() {
        return this.request('/api/schedules');
    }

    // Get schedule by ID
    async getSchedule(scheduleId) {
        return this.request(`/api/schedules/${scheduleId}`);
    }

    // Get appointments for a schedule
    async getAppointments(scheduleId, params = {}) {
        return this.request(`/api/schedules/${scheduleId}/appointments`, params);
    }

    // Get users for a schedule
    async getUsers(scheduleId, params = {}) {
        return this.request(`/api/schedules/${scheduleId}/users`, params);
    }

    // Get resources for a schedule
    async getResources(scheduleId) {
        return this.request(`/api/schedules/${scheduleId}/resources`);
    }

    // Get available slots
    async getSlots(scheduleId, params = {}) {
        return this.request(`/api/schedules/${scheduleId}/slots`, params);
    }

    // Get forms
    async getForms(scheduleId) {
        return this.request(`/api/schedules/${scheduleId}/forms`);
    }

    // Get account info
    async getAccount() {
        return this.request('/api/account');
    }
}

async function exploreInstyleData() {
    console.log('🚀 SuperSaaS Official Client - Instyle Hair Boutique Data Explorer\n');

    // Try different account name possibilities
    const possibleAccounts = [
        'instyle-hair-boutique',
        'instylehairboutique', 
        'instyle',
        'hair-boutique',
        'InstyleHairBoutique'
    ];

    const apiKey = '5ciPW7IzfQRQy1wqdTsH6g';
    
    for (const accountName of possibleAccounts) {
        console.log(`\n🔍 Trying account: ${accountName}`);
        const client = new SuperSaaSClient(accountName, apiKey);
        
        try {
            // Test with account info first
            console.log('📋 Getting account info...');
            const account = await client.getAccount();
            console.log('✅ Account found!');
            console.log(JSON.stringify(account, null, 2));

            // Get schedules
            console.log('\n📅 Getting schedules...');
            const schedules = await client.getSchedules();
            console.log('✅ Schedules retrieved:');
            console.log(JSON.stringify(schedules, null, 2));

            // Explore each schedule
            if (Array.isArray(schedules)) {
                for (const schedule of schedules) {
                    await exploreScheduleData(client, schedule);
                }
            }

            return; // Success, exit
            
        } catch (error) {
            console.log(`❌ Failed with account ${accountName}: ${error.message}`);
        }
    }

    // If account name approach fails, try without account parameter
    console.log('\n🔍 Trying without account parameter...');
    const simpleClient = new SuperSaaSClient('', apiKey);
    
    try {
        const schedules = await simpleClient.getSchedules();
        console.log('✅ Schedules found without account parameter:');
        console.log(JSON.stringify(schedules, null, 2));

        if (Array.isArray(schedules)) {
            for (const schedule of schedules) {
                await exploreScheduleData(simpleClient, schedule);
            }
        }
    } catch (error) {
        console.log(`❌ Also failed without account: ${error.message}`);
        
        // Final attempt - try direct API calls
        console.log('\n🔧 Trying direct API approach...');
        await tryDirectAPI();
    }
}

async function exploreScheduleData(client, schedule) {
    const scheduleId = schedule.id;
    const scheduleName = schedule.name || schedule.title || 'Unknown';
    
    console.log(`\n🏢 Exploring Schedule: ${scheduleName} (ID: ${scheduleId})`);
    
    try {
        // Get detailed schedule info
        console.log('📊 Getting schedule details...');
        const details = await client.getSchedule(scheduleId);
        console.log(JSON.stringify(details, null, 2));

        // Get appointments
        console.log('\n📋 Getting appointments...');
        const appointments = await client.getAppointments(scheduleId);
        console.log(`Found ${appointments?.length || 0} appointments`);
        if (appointments?.length > 0) {
            console.log(JSON.stringify(appointments.slice(0, 5), null, 2)); // Show first 5
        }

        // Get users/clients
        console.log('\n👥 Getting users/clients...');
        const users = await client.getUsers(scheduleId);
        console.log(`Found ${users?.length || 0} users`);
        if (users?.length > 0) {
            console.log(JSON.stringify(users.slice(0, 3), null, 2)); // Show first 3
        }

        // Get resources (services)
        console.log('\n🛠️ Getting resources/services...');
        const resources = await client.getResources(scheduleId);
        console.log(JSON.stringify(resources, null, 2));

        // Get available slots
        console.log('\n🕐 Getting available slots...');
        const slots = await client.getSlots(scheduleId);
        console.log(JSON.stringify(slots, null, 2));

        // Get forms
        console.log('\n📝 Getting forms...');
        const forms = await client.getForms(scheduleId);
        console.log(JSON.stringify(forms, null, 2));

    } catch (error) {
        console.log(`❌ Error exploring schedule ${scheduleId}: ${error.message}`);
    }
}

async function tryDirectAPI() {
    console.log('🔧 Direct API attempt with minimal authentication...');
    
    const apiKey = '5ciPW7IzfQRQy1wqdTsH6g';
    
    const directRequest = (path) => {
        return new Promise((resolve, reject) => {
            const url = `https://www.supersaas.com${path}?api_key=${apiKey}`;
            console.log(`📡 Direct: ${url}`);
            
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
    };

    const endpoints = [
        '/api/schedules',
        '/api/account',
        '/api/schedules.json'
    ];

    for (const endpoint of endpoints) {
        const result = await directRequest(endpoint);
        if (result) {
            console.log('✅ Direct API success:');
            console.log(JSON.stringify(result, null, 2));
            return;
        }
    }
}

// Run the exploration
exploreInstyleData().then(() => {
    console.log('\n🎉 Exploration completed!');
}).catch(error => {
    console.error('❌ Fatal error:', error);
});