#!/usr/bin/env node

/**
 * Marketing Automation Script
 * Generates marketing content and tracks performance
 */

const https = require('https');
const fs = require('fs');

const DOMAIN = 'https://www.instylehairboutique.co.za';
const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

async function getStats() {
  return new Promise((resolve, reject) => {
    https.get(`${DOMAIN}/api/dashboard?tenantId=${TENANT_ID}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function generateMarketingContent() {
  console.log('📊 Generating Marketing Content...');
  
  const stats = await getStats();
  const { totalAppointments, totalRevenue } = stats.stats;
  
  const content = {
    instagram_post: `🎉 ${totalAppointments} happy clients and counting! 

Book your transformation in under 60 seconds ⏰
✨ Middle & Side Installation - R450
✨ Maphondo & Lines - R350  
✨ Hair Extensions - R650

👆 www.instylehairboutique.co.za

#InstyleHairBoutique #BookOnline #HairTransformation #CapeTownHair`,

    whatsapp_message: `Hi! 👋 Instyle Hair Boutique now has instant online booking! 

Book your next appointment in 60 seconds:
www.instylehairboutique.co.za

Same great service, faster booking ✨`,

    google_business_description: `Premium hair transformations in Cape Town. Book online in under 60 seconds! Specializing in Middle & Side Installation, Maphondo & Lines, Hair Extensions, and Hair Treatments. ${totalAppointments}+ satisfied clients. Professional service, modern booking experience.`,

    email_signature: `Instyle Hair Boutique
📞 +27 123 456 789
🌐 Book Online: www.instylehairboutique.co.za
📍 Cape Town, South Africa
✨ ${totalAppointments} happy clients served`,

    performance_summary: {
      total_appointments: totalAppointments,
      total_revenue: totalRevenue,
      website_url: DOMAIN,
      last_updated: new Date().toISOString()
    }
  };

  fs.writeFileSync('./marketing_content.json', JSON.stringify(content, null, 2));
  
  console.log(`✅ Marketing content generated!`);
  console.log(`📊 Stats: ${totalAppointments} appointments, R${totalRevenue} revenue`);
  console.log(`📄 Content saved to: marketing_content.json`);
  
  return content;
}

async function trackPerformance() {
  console.log('📈 Tracking Performance...');
  
  const stats = await getStats();
  const performance = {
    timestamp: new Date().toISOString(),
    metrics: stats.stats,
    appointments: stats.appointments.length,
    website_status: 'live',
    booking_system: 'operational'
  };
  
  // Append to performance log
  const logFile = './performance_log.json';
  let log = [];
  
  try {
    log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  } catch (e) {
    // File doesn't exist, start new log
  }
  
  log.push(performance);
  
  // Keep only last 30 entries
  if (log.length > 30) {
    log = log.slice(-30);
  }
  
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
  
  console.log(`📊 Performance logged: ${performance.appointments} appointments`);
  
  return performance;
}

async function main() {
  try {
    console.log('🚀 Starting Marketing Automation...\n');
    
    const content = await generateMarketingContent();
    const performance = await trackPerformance();
    
    console.log('\n📋 Next Steps:');
    console.log('1. Copy Instagram post from marketing_content.json');
    console.log('2. Update Google Business Profile description');
    console.log('3. Send WhatsApp message to existing clients');
    console.log('4. Update email signatures for all staff');
    console.log('\n🎯 Ready for marketing activation!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateMarketingContent, trackPerformance };