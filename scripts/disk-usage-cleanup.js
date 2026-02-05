/**
 * Disk Usage Analysis and Cleanup Script
 * File: scripts/disk-usage-cleanup.js
 * 
 * Analyzes disk usage and cleans up unnecessary files
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const MAX_LOG_AGE_DAYS = 7;
const EXCLUDED_DIRS = [
    'node_modules', // Will be listed separately
    '.git',
    '.next',
    'dist',
    'build',
    '.cache',
    'tmp',
    'temp',
    'logs',
];

// Directories to analyze
const ANALYZE_DIRS = [
    'apps/booking',
    'apps/marketing',
    'packages',
    'scripts',
    'monitoring',
    'nginx',
    'static-deploy',
    'infrastructure',
    'reports',
    'docs',
    'tests',
    'ai-tools',
];

// File patterns to clean
const CLEAN_PATTERNS = [
    { pattern: '**/*.log', maxAge: MAX_LOG_AGE_DAYS, description: 'Log files older than 7 days' },
    { pattern: '**/.cache/**', maxAge: 0, description: 'Cache directories' },
    { pattern: '**/tmp/**', maxAge: 0, description: 'Temporary files' },
    { pattern: '**/temp/**', maxAge: 0, description: 'Temp directories' },
];

// Results
const results = {
    timestamp: new Date().toISOString(),
    diskUsage: {},
    cleanupcandidates: {},
    cleanupActions: [],
    totalSpaceUsed: 0,
    totalSpaceToFree: 0,
    excludedCritical: [],
};

/**
 * Get directory size recursively
 */
function getDirectorySize(dirPath) {
    let totalSize = 0;
    let fileCount = 0;
    let dirCount = 0;

    if (!fs.existsSync(dirPath)) {
        return { size: 0, files: 0, dirs: 0 };
    }

    function traverse(currentPath) {
        try {
            const stats = fs.statSync(currentPath);
            if (stats.isFile()) {
                totalSize += stats.size;
                fileCount++;
            } else if (stats.isDirectory()) {
                dirCount++;
                const entries = fs.readdirSync(currentPath);
                for (const entry of entries) {
                    traverse(path.join(currentPath, entry));
                }
            }
        } catch (err) {
            // Skip inaccessible files/directories
        }
    }

    traverse(dirPath);
    return { size: totalSize, files: fileCount, dirs: dirCount };
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))  } ${  sizes[i]}`;
}

/**
 * Analyze disk usage for a directory
 */
function analyzeDirectory(dirName) {
    const dirPath = path.join(PROJECT_ROOT, dirName);

    if (!fs.existsSync(dirPath)) {
        results.diskUsage[dirName] = { exists: false };
        return;
    }

    const stats = getDirectorySize(dirPath);

    results.diskUsage[dirName] = {
        path: dirPath,
        size: stats.size,
        sizeFormatted: formatBytes(stats.size),
        files: stats.files,
        directories: stats.dirs,
        exists: true,
    };

    results.totalSpaceUsed += stats.size;
}

/**
 * Find cleanup candidates
 */
function findCleanupCandidates() {
    const cleanupCandidates = {
        nodeModules: [],
        buildOutputs: [],
        cacheDirs: [],
        logFiles: [],
        dockerArtifacts: [],
        tempFiles: [],
    };

    // Check for node_modules
    const nodeModulesPaths = [
        path.join(PROJECT_ROOT, 'apps/booking/node_modules'),
        path.join(PROJECT_ROOT, 'apps/marketing/node_modules'),
        path.join(PROJECT_ROOT, 'packages/node_modules'),
        path.join(PROJECT_ROOT, 'ai-tools/node_modules'),
    ];

    for (const nodePath of nodeModulesPaths) {
        if (fs.existsSync(nodePath)) {
            const stats = getDirectorySize(nodePath);
            cleanupCandidates.nodeModules.push({
                path: nodePath,
                size: stats.size,
                sizeFormatted: formatBytes(stats.size),
                regeneratable: true,
                command: 'npm install / yarn / pnpm install',
            });
        }
    }

    // Check for build outputs
    const buildPaths = [
        path.join(PROJECT_ROOT, 'apps/booking/.next'),
        path.join(PROJECT_ROOT, 'apps/booking/dist'),
        path.join(PROJECT_ROOT, 'apps/marketing/.next'),
        path.join(PROJECT_ROOT, 'apps/marketing/dist'),
        path.join(PROJECT_ROOT, 'packages/dist'),
    ];

    for (const buildPath of buildPaths) {
        if (fs.existsSync(buildPath)) {
            const stats = getDirectorySize(buildPath);
            cleanupCandidates.buildOutputs.push({
                path: buildPath,
                size: stats.size,
                sizeFormatted: formatBytes(stats.size),
                regeneratable: true,
                command: 'npm run build',
            });
        }
    }

    // Check for cache directories
    const cachePaths = [
        path.join(PROJECT_ROOT, 'apps/booking/.cache'),
        path.join(PROJECT_ROOT, 'apps/marketing/.cache'),
        path.join(PROJECT_ROOT, '.cache'),
        path.join(PROJECT_ROOT, 'node_modules/.cache'),
    ];

    for (const cachePath of cachePaths) {
        if (fs.existsSync(cachePath)) {
            const stats = getDirectorySize(cachePath);
            if (stats.size > 0) {
                cleanupCandidates.cacheDirs.push({
                    path: cachePath,
                    size: stats.size,
                    sizeFormatted: formatBytes(stats.size),
                    regeneratable: true,
                    command: 'npm run build (cache will be regenerated)',
                });
            }
        }
    }

    // Find log files older than MAX_LOG_AGE_DAYS
    const logDir = path.join(PROJECT_ROOT, 'nginx/logs');
    if (fs.existsSync(logDir)) {
        const files = fs.readdirSync(logDir);
        const cutoffTime = Date.now() - (MAX_LOG_AGE_DAYS * 24 * 60 * 60 * 1000);

        for (const file of files) {
            const filePath = path.join(logDir, file);
            const stats = fs.statSync(filePath);

            if (stats.mtimeMs < cutoffTime && file.endsWith('.log')) {
                cleanupCandidates.logFiles.push({
                    path: filePath,
                    size: stats.size,
                    sizeFormatted: formatBytes(stats.size),
                    modified: stats.mtime,
                    safeToDelete: true,
                });
            }
        }
    }

    results.cleanupcandidates = cleanupCandidates;

    // Calculate total space that can be freed
    let totalFreeable = 0;
    for (const category of Object.values(cleanupCandidates)) {
        for (const item of category) {
            totalFreeable += item.size || 0;
        }
    }
    results.totalSpaceToFree = totalFreeable;
}

/**
 * Generate cleanup report
 */
function generateReport() {
    console.log(`\n${  '='.repeat(70)}`);
    console.log('  DISK USAGE ANALYSIS AND CLEANUP REPORT');
    console.log('='.repeat(70));

    console.log(`\nTimestamp: ${results.timestamp}`);

    // Directory usage
    console.log('\n--- DIRECTORY USAGE ---');
    console.log(`${'Directory'.padEnd(40) + 'Size'.padEnd(15) + 'Files'.padEnd(10)  }Dirs`);
    console.log('-'.repeat(75));

    const sortedDirs = Object.entries(results.diskUsage)
        .filter(([_, data]) => data.exists)
        .sort((a, b) => b[1].size - a[1].size);

    for (const [dirName, data] of sortedDirs) {
        const name = dirName.length > 38 ? `${dirName.substring(0, 35)  }...` : dirName;
        console.log(
            name.padEnd(40) +
            data.sizeFormatted.padEnd(15) +
            String(data.files).padEnd(10) +
            data.directories
        );
    }

    console.log('-'.repeat(75));
    const totalStr = 'TOTAL';
    console.log(
        totalStr.padEnd(40) +
        formatBytes(results.totalSpaceUsed).padEnd(15)
    );

    // Cleanup candidates
    console.log('\n--- CLEANUP CANDIDATES ---');

    // Node Modules
    if (results.cleanupcandidates.nodeModules.length > 0) {
        console.log('\n1. node_modules (Regeneratable via npm/yarn/pnpm install):');
        for (const item of results.cleanupcandidates.nodeModules) {
            const relPath = path.relative(PROJECT_ROOT, item.path);
            console.log(`   - ${relPath}: ${item.sizeFormatted}`);
        }
    }

    // Build Outputs
    if (results.cleanupcandidates.buildOutputs.length > 0) {
        console.log('\n2. Build Outputs (Regeneratable via npm run build):');
        for (const item of results.cleanupcandidates.buildOutputs) {
            const relPath = path.relative(PROJECT_ROOT, item.path);
            console.log(`   - ${relPath}: ${item.sizeFormatted}`);
        }
    }

    // Cache Directories
    if (results.cleanupcandidates.cacheDirs.length > 0) {
        console.log('\n3. Cache Directories (Regeneratable):');
        for (const item of results.cleanupcandidates.cacheDirs) {
            const relPath = path.relative(PROJECT_ROOT, item.path);
            console.log(`   - ${relPath}: ${item.sizeFormatted}`);
        }
    }

    // Log Files
    if (results.cleanupcandidates.logFiles.length > 0) {
        console.log(`\n4. Log Files (>${MAX_LOG_AGE_DAYS} days old):`);
        let totalLogSize = 0;
        for (const item of results.cleanupcandidates.logFiles) {
            const relPath = path.relative(PROJECT_ROOT, item.path);
            console.log(`   - ${relPath}: ${item.sizeFormatted}`);
            totalLogSize += item.size;
        }
        console.log(`   Total log size: ${formatBytes(totalLogSize)}`);
    }

    // Summary
    console.log('\n--- SPACE SUMMARY ---');
    console.log(`Current Space Used: ${formatBytes(results.totalSpaceUsed)}`);
    console.log(`Space to be Freed: ${formatBytes(results.totalSpaceToFree)}`);
    console.log(`Estimated After Cleanup: ${formatBytes(results.totalSpaceUsed - results.totalSpaceToFree)}`);

    // Safe to delete
    const safeToDelete = results.cleanupcandidates.nodeModules.length +
        results.cleanupcandidates.buildOutputs.length +
        results.cleanupcandidates.cacheDirs.length +
        results.cleanupcandidates.logFiles.length;

    console.log(`\nItems Safe to Delete: ${safeToDelete}`);

    // Critical files (excluded)
    console.log('\n--- EXCLUDED CRITICAL ITEMS ---');
    console.log('The following are protected and will NOT be deleted:');
    console.log('   - .git directory (version control)');
    console.log('   - Configuration files (.env*, config files)');
    console.log('   - Source code (apps/, packages/)');
    console.log('   - Database files (if present)');
    console.log('   - Currently running application data');
    console.log('   - SSL certificates and secrets');

    return results;
}

/**
 * Generate cleanup commands
 */
function generateCleanupCommands() {
    const commands = {
        bash: [],
        powershell: [],
    };

    // Node modules cleanup
    for (const item of results.cleanupcandidates.nodeModules) {
        const relPath = path.relative(PROJECT_ROOT, item.path).replace(/\\/g, '/');
        commands.bash.push(`rm -rf "${relPath}"`);
        commands.powershell.push(`Remove-Item -Path "${relPath}" -Recurse -Force`);
    }

    // Build outputs cleanup
    for (const item of results.cleanupcandidates.buildOutputs) {
        const relPath = path.relative(PROJECT_ROOT, item.path).replace(/\\/g, '/');
        commands.bash.push(`rm -rf "${relPath}"`);
        commands.powershell.push(`Remove-Item -Path "${relPath}" -Recurse -Force`);
    }

    // Cache cleanup
    for (const item of results.cleanupcandidates.cacheDirs) {
        const relPath = path.relative(PROJECT_ROOT, item.path).replace(/\\/g, '/');
        commands.bash.push(`rm -rf "${relPath}"`);
        commands.powershell.push(`Remove-Item -Path "${relPath}" -Recurse -Force`);
    }

    // Log file cleanup
    for (const item of results.cleanupcandidates.logFiles) {
        const relPath = path.relative(PROJECT_ROOT, item.path).replace(/\\/g, '/');
        commands.bash.push(`rm -f "${relPath}"`);
        commands.powershell.push(`Remove-Item -Path "${relPath}" -Force`);
    }

    console.log('\n--- CLEANUP COMMANDS ---');

    console.log('\nBash (Linux/Mac/Git Bash):');
    console.log('# WARNING: Execute from project root directory');
    for (const cmd of commands.bash) {
        console.log(cmd);
    }

    console.log('\nPowerShell (Windows):');
    console.log('# WARNING: Execute from project root directory');
    for (const cmd of commands.powershell) {
        console.log(cmd);
    }

    return commands;
}

/**
 * Perform cleanup (dry run by default)
 */
async function performCleanup(dryRun = true) {
    console.log('\n--- CLEANUP EXECUTION ---');
    console.log(`Mode: ${dryRun ? 'DRY RUN (no files will be deleted)' : 'LIVE (files will be deleted)'}`);

    let deletedCount = 0;
    let freedSpace = 0;
    const errors = [];

    const allItems = [
        ...results.cleanupcandidates.nodeModules,
        ...results.cleanupcandidates.buildOutputs,
        ...results.cleanupcandidates.cacheDirs,
        ...results.cleanupcandidates.logFiles,
    ];

    for (const item of allItems) {
        if (fs.existsSync(item.path)) {
            if (dryRun) {
                console.log(`[DRY RUN] Would delete: ${path.relative(PROJECT_ROOT, item.path)}`);
            } else {
                try {
                    const stats = fs.statSync(item.path);
                    if (item.path.endsWith('/') || fs.statSync(item.path).isDirectory()) {
                        fs.rmSync(item.path, { recursive: true, force: true });
                    } else {
                        fs.unlinkSync(item.path);
                    }
                    deletedCount++;
                    freedSpace += item.size || stats.size;
                    console.log(`[DELETED] ${path.relative(PROJECT_ROOT, item.path)}`);
                } catch (err) {
                    errors.push({ path: item.path, error: err.message });
                }
            }
        }
    }

    console.log(`\n${dryRun ? 'Would delete' : 'Deleted'}: ${deletedCount} items`);
    console.log(`Space ${dryRun ? 'would be' : 'was'} freed: ${formatBytes(freedSpace)}`);

    if (errors.length > 0) {
        console.log('\nErrors encountered:');
        for (const err of errors) {
            console.log(`  - ${err.path}: ${err.error}`);
        }
    }

    return { deletedCount, freedSpace, errors };
}

/**
 * Main execution
 */
async function main() {
    console.log(`\n${  '='.repeat(70)}`);
    console.log('  DISK USAGE ANALYSIS FOR APPOINTMENTBOOKING MONOREPO');
    console.log('='.repeat(70));

    // Analyze directories
    console.log('\nAnalyzing directories...');
    for (const dir of ANALYZE_DIRS) {
        analyzeDirectory(dir);
    }

    // Find cleanup candidates
    console.log('Finding cleanup candidates...');
    findCleanupCandidates();

    // Generate report
    generateReport();

    // Generate cleanup commands
    generateCleanupCommands();

    // Ask for cleanup mode
    console.log('\n--- CLEANUP OPTIONS ---');
    console.log('1. Dry run (preview what will be deleted)');
    console.log('2. Execute cleanup (delete files)');
    console.log('3. Exit without cleanup');

    // Save report to file
    const reportPath = path.join(PROJECT_ROOT, 'reports/disk-usage-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}`);

    console.log('\n✅ Disk usage analysis complete');
    console.log('To execute cleanup, run this script with --cleanup flag');
}

// Export for testing
module.exports = {
    getDirectorySize,
    formatBytes,
    analyzeDirectory,
    findCleanupCandidates,
    generateReport,
    generateCleanupCommands,
    performCleanup,
};

// Run if executed directly
if (require.main === module) {
    const args = process.argv.slice(2);
    const cleanupMode = args.includes('--cleanup');
    const dryRun = !cleanupMode;

    main().then(() => {
        if (cleanupMode) {
            performCleanup(false);
        }
    });
}
