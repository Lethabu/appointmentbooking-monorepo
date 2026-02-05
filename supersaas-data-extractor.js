// SuperSaaS Data Extractor - Use after fixing API credentials
const fs = require('fs');
const https = require('https');

class SuperSaaSDataExtractor {
    constructor(accountName, apiKey, scheduleId) {
        this.accountName = accountName;
        this.apiKey = apiKey;
        this.scheduleId = scheduleId;
        this.baseUrl = 'www.supersaas.com';
    }

    async request(path, params = {}) {
        return new Promise((resolve, reject) => {
            const allParams = {
                ...params,
                account: this.accountName,
                api_key: this.apiKey
            };

            const queryString = new URLSearchParams(allParams).toString();
            const fullPath = `${path}?${queryString}`;

            const options = {
                hostname: this.baseUrl,
                path: fullPath,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'InstyleHairBoutique/1.0'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            resolve(data);
                        }
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('error', reject);
            req.end();
        });
    }

    async extractAllData() {
        console.log('🚀 Starting comprehensive data extraction...\n');
        
        const extractedData = {
            timestamp: new Date().toISOString(),
            account: this.accountName,
            scheduleId: this.scheduleId,
            data: {}
        };

        try {
            // 1. Schedule Configuration
            console.log('📊 Extracting schedule configuration...');
            extractedData.data.schedule = await this.request(`/api/schedules/${this.scheduleId}`);
            console.log('✅ Schedule config extracted');

            // 2. All Appointments (last 6 months)
            console.log('📋 Extracting appointments...');
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            
            extractedData.data.appointments = await this.request(
                `/api/schedules/${this.scheduleId}/appointments`,
                { from: sixMonthsAgo.toISOString().split('T')[0] }
            );
            console.log(`✅ ${extractedData.data.appointments?.length || 0} appointments extracted`);

            // 3. All Users/Clients
            console.log('👥 Extracting users/clients...');
            extractedData.data.users = await this.request(`/api/schedules/${this.scheduleId}/users`);
            console.log(`✅ ${extractedData.data.users?.length || 0} users extracted`);

            // 4. Resources (Services/Staff)
            console.log('🛠️ Extracting resources/services...');
            extractedData.data.resources = await this.request(`/api/schedules/${this.scheduleId}/resources`);
            console.log(`✅ ${extractedData.data.resources?.length || 0} resources extracted`);

            // 5. Available Slots
            console.log('🕐 Extracting available slots...');
            extractedData.data.slots = await this.request(`/api/schedules/${this.scheduleId}/slots`);
            console.log('✅ Slots extracted');

            // 6. Forms Configuration
            console.log('📝 Extracting forms...');
            extractedData.data.forms = await this.request(`/api/schedules/${this.scheduleId}/forms`);
            console.log('✅ Forms extracted');

            // 7. Custom Fields
            console.log('🏷️ Extracting custom fields...');
            try {
                extractedData.data.fields = await this.request(`/api/schedules/${this.scheduleId}/fields`);
                console.log('✅ Custom fields extracted');
            } catch (e) {
                console.log('⚠️ Custom fields not available');
                extractedData.data.fields = null;
            }

            // Save to file
            const filename = `supersaas-data-${Date.now()}.json`;
            fs.writeFileSync(filename, JSON.stringify(extractedData, null, 2));
            console.log(`\n💾 Data saved to: ${filename}`);

            // Generate summary
            this.generateSummary(extractedData.data);

            return extractedData;

        } catch (error) {
            console.error('❌ Extraction failed:', error.message);
            throw error;
        }
    }

    generateSummary(data) {
        console.log('\n📊 DATA SUMMARY:');
        console.log('================');
        
        // Schedule info
        if (data.schedule) {
            console.log(`📅 Schedule: ${data.schedule.name || 'Unknown'}`);
            console.log(`   Description: ${data.schedule.description || 'N/A'}`);
        }

        // Appointments summary
        if (data.appointments) {
            console.log(`📋 Appointments: ${data.appointments.length} total`);
            
            // Group by status
            const statusCounts = {};
            data.appointments.forEach(apt => {
                const status = apt.status || 'unknown';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });
            
            Object.entries(statusCounts).forEach(([status, count]) => {
                console.log(`   ${status}: ${count}`);
            });
        }

        // Users summary
        if (data.users) {
            console.log(`👥 Users/Clients: ${data.users.length} total`);
        }

        // Resources summary
        if (data.resources) {
            console.log(`🛠️ Resources/Services: ${data.resources.length} total`);
            data.resources.forEach(resource => {
                console.log(`   - ${resource.name}: ${resource.description || 'No description'}`);
            });
        }

        // Extract pricing information
        this.extractPricingInfo(data);
    }

    extractPricingInfo(data) {
        console.log('\n💰 PRICING INFORMATION:');
        console.log('=======================');

        // Look for pricing in resources
        if (data.resources) {
            data.resources.forEach(resource => {
                if (resource.price || resource.cost) {
                    console.log(`💵 ${resource.name}: $${resource.price || resource.cost}`);
                }
                if (resource.duration) {
                    console.log(`⏱️ ${resource.name}: ${resource.duration} minutes`);
                }
            });
        }

        // Look for pricing in appointments
        if (data.appointments) {
            const uniquePrices = new Set();
            data.appointments.forEach(apt => {
                if (apt.price) uniquePrices.add(apt.price);
                if (apt.cost) uniquePrices.add(apt.cost);
            });
            
            if (uniquePrices.size > 0) {
                console.log('💰 Prices found in appointments:', Array.from(uniquePrices));
            }
        }
    }
}

// Usage example (update with your correct credentials)
async function main() {
    console.log('🔧 SuperSaaS Data Extractor');
    console.log('============================\n');
    
    // TODO: Update these with your correct values
    const ACCOUNT_NAME = 'YOUR_ACCOUNT_NAME';  // Find this in your SuperSaaS URL
    const API_KEY = '5ciPW7IzfQRQy1wqdTsH6g';     // Verify this is correct
    const SCHEDULE_ID = 'YOUR_SCHEDULE_ID';    // Usually a number, not "Instyle Hair Boutique"

    console.log('⚠️ IMPORTANT: Update the credentials above before running!');
    console.log(`   Account Name: ${ACCOUNT_NAME}`);
    console.log(`   API Key: ${API_KEY.substring(0, 8)}...`);
    console.log(`   Schedule ID: ${SCHEDULE_ID}\n`);

    if (ACCOUNT_NAME === 'YOUR_ACCOUNT_NAME') {
        console.log('❌ Please update the credentials in the script first!');
        console.log('\n📋 Steps to get correct credentials:');
        console.log('1. Log into SuperSaaS dashboard');
        console.log('2. Check your URL for account name (subdomain)');
        console.log('3. Go to Account Settings → API to verify API key');
        console.log('4. Find your schedule ID (usually a number)');
        return;
    }

    const extractor = new SuperSaaSDataExtractor(ACCOUNT_NAME, API_KEY, SCHEDULE_ID);
    
    try {
        await extractor.extractAllData();
        console.log('\n🎉 Data extraction completed successfully!');
    } catch (error) {
        console.error('\n❌ Extraction failed:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Verify API key is active in SuperSaaS dashboard');
        console.log('2. Check account name matches your SuperSaaS subdomain');
        console.log('3. Confirm schedule ID is correct (usually numeric)');
        console.log('4. Ensure API key has read permissions');
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = SuperSaaSDataExtractor;