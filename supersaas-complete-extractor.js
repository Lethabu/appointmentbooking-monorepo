const https = require('https');
const fs = require('fs');

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
        
        console.log(`📡 ${endpoint} - ${JSON.stringify(params)}`);
        
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

async function extractCompleteData() {
    console.log('🚀 Complete Instyle Hair Boutique Data Extraction\n');
    
    const data = {
        timestamp: new Date().toISOString(),
        services: [],
        clients: [],
        appointments: [],
        stats: {}
    };
    
    // 1. Services
    console.log('🛠️ Getting services...');
    data.services = await apiRequest('resources.json') || [];
    
    // 2. All clients
    console.log('\n👥 Getting all clients...');
    data.clients = await apiRequest('users.json') || [];
    
    // 3. Get appointments for different time periods
    console.log('\n📋 Getting appointments...');
    
    // Try different endpoints for appointments
    const appointmentEndpoints = [
        { endpoint: 'appointments.json', params: {} },
        { endpoint: 'appointments.json', params: { limit: 1000 } },
        { endpoint: 'appointments.json', params: { from: '2023-01-01' } },
        { endpoint: 'appointments.json', params: { from: '2024-01-01' } },
        { endpoint: 'appointments.json', params: { from: '2025-01-01' } }
    ];
    
    for (const { endpoint, params } of appointmentEndpoints) {
        const appointments = await apiRequest(endpoint, params);
        if (appointments && Array.isArray(appointments) && appointments.length > 0) {
            data.appointments = appointments;
            console.log(`✅ Found ${appointments.length} appointments`);
            break;
        }
    }
    
    // Try alternative appointment endpoints
    if (!data.appointments.length) {
        console.log('\n🔍 Trying alternative appointment endpoints...');
        const alternatives = [
            'bookings.json',
            'reservations.json',
            'events.json'
        ];
        
        for (const alt of alternatives) {
            const result = await apiRequest(alt);
            if (result && Array.isArray(result) && result.length > 0) {
                data.appointments = result;
                console.log(`✅ Found ${result.length} appointments via ${alt}`);
                break;
            }
        }
    }
    
    // Get appointments by user ID if direct approach fails
    if (!data.appointments.length && data.clients.length > 0) {
        console.log('\n🔍 Getting appointments by user...');
        const userAppointments = [];
        
        for (let i = 0; i < Math.min(10, data.clients.length); i++) {
            const client = data.clients[i];
            const userAppts = await apiRequest('appointments.json', { user: client.id });
            if (userAppts && Array.isArray(userAppts)) {
                userAppointments.push(...userAppts);
            }
        }
        
        if (userAppointments.length > 0) {
            data.appointments = userAppointments;
            console.log(`✅ Found ${userAppointments.length} appointments by user lookup`);
        }
    }
    
    // 4. Additional data
    console.log('\n📊 Getting additional data...');
    
    const additionalEndpoints = [
        'slots.json',
        'forms.json',
        'fields.json',
        'changes.json',
        'agenda.json'
    ];
    
    for (const endpoint of additionalEndpoints) {
        const result = await apiRequest(endpoint);
        if (result) {
            data[endpoint.replace('.json', '')] = result;
        }
    }
    
    // Generate stats
    data.stats = {
        totalServices: data.services.length,
        totalClients: data.clients.length,
        totalAppointments: data.appointments.length,
        activeClients: data.clients.filter(c => 
            new Date(c.last_login) > new Date(Date.now() - 90*24*60*60*1000)
        ).length,
        clientLocations: {}
    };
    
    // Analyze client locations
    data.clients.forEach(client => {
        if (client.address) {
            const location = client.address.toLowerCase();
            if (location.includes('soshanguve')) {
                data.stats.clientLocations.soshanguve = (data.stats.clientLocations.soshanguve || 0) + 1;
            } else if (location.includes('mabopane')) {
                data.stats.clientLocations.mabopane = (data.stats.clientLocations.mabopane || 0) + 1;
            } else if (location.includes('pretoria')) {
                data.stats.clientLocations.pretoria = (data.stats.clientLocations.pretoria || 0) + 1;
            } else {
                data.stats.clientLocations.other = (data.stats.clientLocations.other || 0) + 1;
            }
        }
    });
    
    // Save complete data
    const filename = `instyle-complete-data-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    
    console.log(`\n💾 Complete data saved to: ${filename}`);
    console.log('\n📊 COMPLETE DATA SUMMARY:');
    console.log('========================');
    console.log(`Services: ${data.stats.totalServices}`);
    console.log(`Clients: ${data.stats.totalClients}`);
    console.log(`Active Clients: ${data.stats.activeClients}`);
    console.log(`Appointments: ${data.stats.totalAppointments}`);
    console.log(`Client Locations:`, data.stats.clientLocations);
    
    // Process for booking system
    const bookingSystemData = {
        services: data.services.map(service => ({
            id: service.id,
            name: service.name,
            duration: estimateDuration(service.name),
            price: estimatePrice(service.name),
            category: categorizeService(service.name),
            description: `Professional ${service.name.toLowerCase()} service`
        })),
        clients: data.clients.map(client => ({
            id: client.id,
            name: client.full_name || client.name,
            email: client.name,
            phone: client.mobile,
            address: client.address,
            createdAt: client.created_on,
            lastLogin: client.last_login,
            isActive: new Date(client.last_login) > new Date(Date.now() - 90*24*60*60*1000)
        })),
        appointments: data.appointments.map(apt => ({
            id: apt.id,
            clientId: apt.user_id,
            serviceId: apt.resource_id,
            startTime: apt.start,
            endTime: apt.finish,
            status: apt.status,
            notes: apt.description,
            createdAt: apt.created_on
        })),
        stats: data.stats
    };
    
    fs.writeFileSync('instyle-booking-system-data.json', JSON.stringify(bookingSystemData, null, 2));
    console.log('\n💾 Booking system data saved to: instyle-booking-system-data.json');
    
    return data;
}

function estimateDuration(serviceName) {
    const name = serviceName.toLowerCase();
    if (name.includes('installation')) return 180;
    if (name.includes('makeup')) return 60;
    if (name.includes('styling')) return 90;
    if (name.includes('ponytail')) return 120;
    return 120;
}

function estimatePrice(serviceName) {
    const name = serviceName.toLowerCase();
    if (name.includes('installation')) return 800;
    if (name.includes('makeup')) return 300;
    if (name.includes('styling')) return 250;
    if (name.includes('ponytail')) return 400;
    return 350;
}

function categorizeService(serviceName) {
    const name = serviceName.toLowerCase();
    if (name.includes('installation')) return 'Hair Installation';
    if (name.includes('makeup')) return 'Makeup';
    if (name.includes('styling')) return 'Hair Styling';
    if (name.includes('ponytail')) return 'Hair Styling';
    return 'Hair Services';
}

extractCompleteData().catch(console.error);