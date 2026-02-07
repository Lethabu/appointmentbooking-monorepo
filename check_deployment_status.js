#!/usr/bin/env node

const https = require('https');

const GITHUB_REPO = 'Lethabu/appointmentbooking-monorepo';
const WORKFLOW_FILE = 'cloudflare-deploy.yml';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Node.js Deploy-Monitor' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function checkDeployment() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=1`;
    const data = await httpsGet(url);
    const run = data.workflow_runs?.[0];

    if (!run) {
      console.log('No workflow run found');
      return;
    }

    console.log(`\n📊 Latest Deployment Status:`);
    console.log(`   Run ID: ${run.id}`);
    console.log(`   Status: ${run.status}`);
    console.log(`   Conclusion: ${run.conclusion || 'in_progress'}`);
    console.log(`   Created: ${run.created_at}`);
    console.log(`   URL: ${run.html_url}`);
    console.log(`   Commit: ${run.head_sha.substring(0, 7)}`);

    const firstLine = run.head_commit?.message.split('\n')[0] || 'N/A';
    console.log(`   Commit Message: ${firstLine}`);

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

checkDeployment();
