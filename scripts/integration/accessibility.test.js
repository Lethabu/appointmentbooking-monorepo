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
  const dom = new JSDOM(html, { url: BASE + '/shop' });
  const { window } = dom;

  // inject axe into the window
  const script = axe.source || axe; // axe-core exposes source in some installs
  window.eval(script);

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
