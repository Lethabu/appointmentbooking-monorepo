const fs = require('fs');

// Load existing SuperSaaS data
const supersaasData = JSON.parse(fs.readFileSync('instyle-booking-system-data.json', 'utf8'));
const csvAnalysis = JSON.parse(fs.readFileSync('instyle-csv-analysis.json', 'utf8'));

function integrateCSVWithSupersaas() {
    console.log('🔄 INTEGRATING CSV DATA WITH SUPERSAAS DATA');
    console.log('==========================================\n');
    
    // Compare data sources
    console.log('📊 DATA SOURCE COMPARISON:');
    console.log(`SuperSaaS Appointments: ${supersaasData.appointments.length}`);
    console.log(`CSV Total Services: ${csvAnalysis.summary.totalServices}`);
    console.log(`SuperSaaS Clients: ${supersaasData.clients.length}`);
    console.log(`SuperSaaS Services: ${supersaasData.services.length}`);
    
    // Revenue comparison
    const supersaasRevenue = supersaasData.appointments.reduce((total, apt) => {
        return total + (apt.price || 0);
    }, 0) / 100; // Convert from cents
    
    console.log('\n💰 REVENUE COMPARISON:');
    console.log(`CSV Revenue: R${csvAnalysis.revenue.totalRevenue.toLocaleString()}`);
    console.log(`SuperSaaS Revenue: R${supersaasRevenue.toLocaleString()}`);
    
    // Service breakdown
    const supersaasServiceCounts = {};
    supersaasData.appointments.forEach(apt => {
        const serviceName = apt.serviceName || 'Unknown';
        supersaasServiceCounts[serviceName] = (supersaasServiceCounts[serviceName] || 0) + 1;
    });
    
    console.log('\n🛠️ SERVICE BREAKDOWN COMPARISON:');
    console.log('CSV Data:');
    console.log(`  Middle & Side: ${csvAnalysis.summary.totalMiddleSide}`);
    console.log(`  Maphondo & Lines: ${csvAnalysis.summary.totalMaphondo}`);
    
    console.log('SuperSaaS Data:');
    Object.entries(supersaasServiceCounts).forEach(([service, count]) => {
        console.log(`  ${service}: ${count}`);
    });
    
    // Create comprehensive dataset
    const integratedData = {
        timestamp: new Date().toISOString(),
        dataSources: {
            supersaas: {
                appointments: supersaasData.appointments.length,
                clients: supersaasData.clients.length,
                services: supersaasData.services.length,
                revenue: supersaasRevenue
            },
            csv: {
                totalServices: csvAnalysis.summary.totalServices,
                activeDays: csvAnalysis.summary.activeDays,
                revenue: csvAnalysis.revenue.totalRevenue
            }
        },
        services: supersaasData.services,
        clients: supersaasData.clients,
        appointments: supersaasData.appointments,
        businessMetrics: {
            totalRevenue: Math.max(supersaasRevenue, csvAnalysis.revenue.totalRevenue),
            averageRevenuePerDay: csvAnalysis.summary.averageRevenuePerDay,
            peakDays: csvAnalysis.peakDays,
            monthlyStats: csvAnalysis.monthlyStats,
            servicePopularity: {
                middleAndSide: csvAnalysis.summary.totalMiddleSide,
                maphondoAndLines: csvAnalysis.summary.totalMaphondo
            }
        },
        insights: {
            mostPopularService: 'Middle & Side Installation',
            peakMonth: 'April',
            averageServicesPerDay: csvAnalysis.summary.averagePerDay,
            clientRetention: `${supersaasData.stats.activeClients}/${supersaasData.stats.totalClients} active`,
            geographicDistribution: supersaasData.stats.clientLocations
        }
    };
    
    // Save integrated data
    fs.writeFileSync('instyle-integrated-data.json', JSON.stringify(integratedData, null, 2));
    
    console.log('\n📋 BUSINESS INSIGHTS:');
    console.log(`Most Popular Service: ${integratedData.insights.mostPopularService}`);
    console.log(`Peak Performance Month: ${integratedData.insights.peakMonth}`);
    console.log(`Client Retention Rate: ${(supersaasData.stats.activeClients/supersaasData.stats.totalClients*100).toFixed(1)}%`);
    console.log(`Geographic Concentration: ${supersaasData.stats.clientLocations.soshanguve}/${supersaasData.stats.totalClients} in Soshanguve`);
    
    console.log('\n💾 Integrated data saved to: instyle-integrated-data.json');
    console.log('\n✅ DATA INTEGRATION COMPLETE');
    
    return integratedData;
}

integrateCSVWithSupersaas();