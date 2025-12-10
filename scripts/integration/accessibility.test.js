// Accessibility smoke test using jsdom + axe-core against public /shop page
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axe = require('axe-core');

const BASE = process.env.DEPLOY_URL || 'https://www.instylehairboutique.co.za';

async function run() {
  console.log('Running accessibility check against', BASE + '/shop');
  const res = await fetch(BASE + '/shop');
  if (!res.ok) {
    console.error('Failed to fetch /shop', res.status);
    process.exit(2);
  }
  const html = await res.text();
  const dom = new JSDOM(html, { url: BASE + '/shop', runScripts: 'dangerously', resources: 'usable' });
  const { window } = dom;

  // Inject axe by loading the minified axe script from the package
  const fs = require('fs');
  const path = require('path');
  const axeMinPath = require.resolve('axe-core/axe.min.js');
  const axeSource = fs.readFileSync(axeMinPath, 'utf8');
  // Evaluate axe in the JSDOM window
  window.eval(axeSource);

  if (!window.axe || typeof window.axe.run !== 'function') {
    throw new Error('axe not loaded into JSDOM window');
  }

  const results = await window.axe.run(window.document);
  if (results.violations && results.violations.length > 0) {
    console.error('Accessibility violations found:', results.violations.length);
    results.violations.forEach((v) => {
      console.error(` - ${v.id}: ${v.help} (impact: ${v.impact})`);
    });
    process.exit(2);
  }

  console.log('No accessibility violations found (axe).');
}

run().catch((e) => { console.error(e); process.exit(2); });
