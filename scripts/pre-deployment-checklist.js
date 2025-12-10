// Pre-Deployment Checklist Script
// File: scripts/pre-deployment-checklist.js

/**
 * Pre-Deployment Checklist for Instyle Hair Boutique
 * 
 * This script verifies that all critical requirements are met before deployment
 * Run with: node scripts/pre-deployment-checklist.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    bold: '\x1b[1m',
};

// Checklist items
const checklist = {
    'Environment Variables': [
        { name: 'NEXT_PUBLIC_TENANT_ID', required: true },
        { name: 'NEXT_PUBLIC_SUPABASE_URL', required: true },
        { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true },
        { name: 'OPENAI_API_KEY', required: true },
        { name: 'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY', required: false },
    ],
    'Database': [
        { name: 'Tenant configuration exists', check: 'database' },
        { name: 'Services data migrated (5 services)', check: 'database' },
        { name: 'Database schema up to date', check: 'database' },
    ],
    'Code Quality': [
        { name: 'TypeScript compilation successful', check: 'build' },
        { name: 'ESLint passes', check: 'lint' },
        { name: 'No console.log in production code', check: 'code' },
    ],
    'Testing': [
        { name: 'E2E tests passing', check: 'tests' },
        { name: 'Unit tests passing', check: 'tests' },
        { name: 'Code coverage >80%', check: 'coverage' },
    ],
    'Performance': [
        { name: 'Lighthouse score >90', check: 'lighthouse' },
        { name: 'Page load time <2.5s', check: 'performance' },
        { name: 'API response time <200ms', check: 'performance' },
    ],
    'Security': [
        { name: 'HTTPS enforced', check: 'security' },
        { name: 'Rate limiting configured', check: 'security' },
        { name: 'POPIA compliance verified', check: 'compliance' },
        { name: 'No sensitive data in logs', check: 'security' },
    ],
    'Content': [
        { name: 'All services have descriptions', check: 'content' },
        { name: 'Contact information correct', check: 'content' },
        { name: 'Social media links updated', check: 'content' },
        { name: 'Privacy policy published', check: 'content' },
        { name: 'Terms of service published', check: 'content' },
    ],
    'Monitoring': [
        { name: 'Cloudflare Analytics enabled', check: 'monitoring' },
        { name: 'Sentry error tracking configured', check: 'monitoring' },
        { name: 'Alert channels configured', check: 'monitoring' },
    ],
};

// Results tracking
const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    warnings: 0,
};

// Helper functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(`  ${title}`, 'bold');
    console.log('='.repeat(60));
}

function logItem(status, message) {
    const symbols = {
        pass: '✓',
        fail: '✗',
        skip: '○',
        warn: '⚠',
    };
    const statusColors = {
        pass: 'green',
        fail: 'red',
        skip: 'yellow',
        warn: 'yellow',
    };

    console.log(
        `${colors[statusColors[status]]}${symbols[status]}${colors.reset} ${message}`
    );
}

// Check environment variables
function checkEnvironmentVariables() {
    logSection('Environment Variables');

    const envPath = path.join(__dirname, '../apps/booking/.env.local');
    const envExamplePath = path.join(__dirname, '../apps/booking/.env.example');

    if (!fs.existsSync(envPath)) {
        logItem('warn', '.env.local file not found');
        results.warnings++;
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');

    checklist['Environment Variables'].forEach((item) => {
        const regex = new RegExp(`^${item.name}=.+`, 'm');
        const found = regex.test(envContent);

        if (found) {
            logItem('pass', `${item.name} is set`);
            results.passed++;
        } else if (item.required) {
            logItem('fail', `${item.name} is missing (required)`);
            results.failed++;
        } else {
            logItem('warn', `${item.name} is missing (optional)`);
            results.warnings++;
        }
    });
}

// Check files exist
function checkFilesExist() {
    logSection('Required Files');

    const requiredFiles = [
        'apps/booking/components/booking/BookingWizard.tsx',
        'apps/booking/components/booking/BookingContext.tsx',
        'apps/booking/components/booking/Step1ServiceSelection.tsx',
        'apps/booking/components/booking/Step2DateTime.tsx',
        'apps/booking/components/booking/Step3CustomerDetails.tsx',
        'apps/booking/components/booking/Step4PaymentSummary.tsx',
        'apps/booking/components/booking/Step5Confirmation.tsx',
        'packages/db/src/schema.ts',
        'packages/worker/src/index.ts',
    ];

    requiredFiles.forEach((file) => {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            logItem('pass', file);
            results.passed++;
        } else {
            logItem('fail', `${file} not found`);
            results.failed++;
        }
    });
}

// Check documentation
function checkDocumentation() {
    logSection('Documentation');

    const requiredDocs = [
        'docs/INSTYLE_PRD_V2.md',
        'docs/API_SPECIFICATION.md',
        'docs/MONITORING_SETUP.md',
        'docs/PHASE_2_KICKOFF.md',
        'docs/BOOKING_WIZARD_COMPLETE.md',
        'docs/README.md',
    ];

    requiredDocs.forEach((doc) => {
        const docPath = path.join(__dirname, '..', doc);
        if (fs.existsSync(docPath)) {
            logItem('pass', doc);
            results.passed++;
        } else {
            logItem('warn', `${doc} not found`);
            results.warnings++;
        }
    });
}

// Check package.json scripts
function checkPackageScripts() {
    logSection('Package Scripts');

    const packagePath = path.join(__dirname, '../apps/booking/package.json');

    if (!fs.existsSync(packagePath)) {
        logItem('fail', 'package.json not found');
        results.failed++;
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredScripts = ['dev', 'build', 'test', 'lint'];

    requiredScripts.forEach((script) => {
        if (packageJson.scripts && packageJson.scripts[script]) {
            logItem('pass', `Script "${script}" exists`);
            results.passed++;
        } else {
            logItem('warn', `Script "${script}" missing`);
            results.warnings++;
        }
    });
}

// Check for common issues
function checkCommonIssues() {
    logSection('Common Issues Check');

    // Check for console.log in production code
    const componentsDir = path.join(__dirname, '../apps/booking/components');

    if (fs.existsSync(componentsDir)) {
        let consoleLogsFound = false;

        function checkDirectory(dir) {
            const files = fs.readdirSync(dir);

            files.forEach((file) => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    checkDirectory(filePath);
                } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('console.log') && !content.includes('// console.log')) {
                        consoleLogsFound = true;
                    }
                }
            });
        }

        checkDirectory(componentsDir);

        if (consoleLogsFound) {
            logItem('warn', 'console.log statements found in code');
            results.warnings++;
        } else {
            logItem('pass', 'No console.log statements in production code');
            results.passed++;
        }
    }

    // Check for TODO/FIXME comments
    let todosFound = false;

    if (fs.existsSync(componentsDir)) {
        function checkTodos(dir) {
            const files = fs.readdirSync(dir);

            files.forEach((file) => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    checkTodos(filePath);
                } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('TODO') || content.includes('FIXME')) {
                        todosFound = true;
                    }
                }
            });
        }

        checkTodos(componentsDir);

        if (todosFound) {
            logItem('warn', 'TODO/FIXME comments found in code');
            results.warnings++;
        } else {
            logItem('pass', 'No TODO/FIXME comments in code');
            results.passed++;
        }
    }
}

// Manual checklist items
function displayManualChecklist() {
    logSection('Manual Verification Required');

    const manualItems = [
        'Verify database connection works',
        'Test booking flow end-to-end',
        'Verify WhatsApp integration works',
        'Test payment flow (if Paystack configured)',
        'Verify email notifications work',
        'Test on mobile devices',
        'Verify all links work (social media, etc.)',
        'Check Lighthouse score in production',
        'Verify HTTPS certificate is valid',
        'Test error handling (network failures)',
        'Verify POPIA compliance notice displays',
        'Test accessibility with screen reader',
    ];

    log('\nPlease manually verify the following:', 'yellow');
    manualItems.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item}`);
    });
}

// Generate summary
function generateSummary() {
    logSection('Summary');

    const total = results.passed + results.failed + results.skipped + results.warnings;
    const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;

    console.log(`\nTotal Checks: ${total}`);
    log(`✓ Passed: ${results.passed}`, 'green');
    log(`✗ Failed: ${results.failed}`, 'red');
    log(`⚠ Warnings: ${results.warnings}`, 'yellow');
    log(`○ Skipped: ${results.skipped}`, 'yellow');
    console.log(`\nPass Rate: ${passRate}%`);

    if (results.failed > 0) {
        log('\n❌ DEPLOYMENT NOT RECOMMENDED', 'red');
        log('Please fix the failed checks before deploying.', 'red');
        process.exit(1);
    } else if (results.warnings > 5) {
        log('\n⚠️  DEPLOYMENT WITH CAUTION', 'yellow');
        log('Several warnings found. Review before deploying.', 'yellow');
    } else {
        log('\n✅ READY FOR DEPLOYMENT', 'green');
        log('All critical checks passed!', 'green');
    }
}

// Main execution
function main() {
    log('\n' + '='.repeat(60), 'blue');
    log('  INSTYLE HAIR BOUTIQUE - PRE-DEPLOYMENT CHECKLIST', 'bold');
    log('='.repeat(60) + '\n', 'blue');

    checkEnvironmentVariables();
    checkFilesExist();
    checkDocumentation();
    checkPackageScripts();
    checkCommonIssues();
    displayManualChecklist();
    generateSummary();
}

// Run the checklist
main();
