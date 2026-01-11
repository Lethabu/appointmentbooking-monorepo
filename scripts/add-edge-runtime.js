/**
 * Add Edge Runtime Configuration to Next.js API Routes
 *
 * This script adds `export const runtime = 'edge'` to all API route files
 * to enable Cloudflare Pages compatibility.
 */

const fs = require('fs');
const path = require('path');

const EDGE_RUNTIME_COMMENT = `// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
export const runtime = 'edge';

`;

const apiDir = path.join(__dirname, '../apps/booking/app/api');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Check if it's a route directory (contains route.ts)
            const routeFile = path.join(fullPath, 'route.ts');
            if (fs.existsSync(routeFile)) {
                addEdgeRuntime(routeFile);
            }
            // Recursively process subdirectories
            processDirectory(fullPath);
        } else if (file === 'route.ts' && dir !== apiDir) {
            // Top-level route files
            addEdgeRuntime(fullPath);
        }
    }
}

function addEdgeRuntime(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if edge runtime is already configured
    if (content.includes('export const runtime')) {
        console.log(`⏭️  Skipping (already has runtime config): ${filePath}`);
        return;
    }

    // Add edge runtime configuration
    // Insert after imports and before the handler
    const importEnd = content.indexOf('\n\n') + 1;
    content = content.slice(0, importEnd) + EDGE_RUNTIME_COMMENT + content.slice(importEnd);

    fs.writeFileSync(filePath, content);
    console.log(`✅ Added edge runtime: ${filePath}`);
}

console.log('🔧 Adding Edge Runtime Configuration to API Routes\n');

if (!fs.existsSync(apiDir)) {
    console.error('❌ API directory not found:', apiDir);
    process.exit(1);
}

processDirectory(apiDir);
console.log('\n✨ Done! All API routes now have edge runtime configuration.');
