#!/usr/bin/env node

/**
 * Bundle Size Checker
 *
 * Validates that build output meets bundle size limits.
 * Ensures optimal performance by detecting bundle bloat.
 *
 * Exit codes:
 * - 0: Bundle sizes within limits
 * - 1: Bundle sizes exceed limits
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Default bundle size limits (bytes)
const DEFAULT_LIMITS = {
  mainJs: 512000,      // 500KB
  css: 102400,         // 100KB
  totalPage: 2097152   // 2MB
};

function loadConfig() {
  try {
    const configPath = path.join(__dirname, '../deployment-config.json');
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    return config.bundleSizeLimits || DEFAULT_LIMITS;
  } catch {
    return DEFAULT_LIMITS;
  }
}

function getDirectorySize(dirPath) {
  let totalSize = 0;

  if (!fs.existsSync(dirPath)) {
    return 0;
  }

  function traverse(currentPath) {
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      files.forEach(file => {
        traverse(path.join(currentPath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }

  traverse(dirPath);
  return totalSize;
}

function findLargestFiles(dirPath, count = 10) {
  const files = [];

  if (!fs.existsSync(dirPath)) {
    return files;
  }

  function traverse(currentPath) {
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory()) {
      const items = fs.readdirSync(currentPath);
      items.forEach(item => {
        traverse(path.join(currentPath, item));
      });
    } else {
      files.push({
        path: currentPath.replace(dirPath, '').replace(/\\/g, '/'),
        size: stats.size
      });
    }
  }

  traverse(dirPath);

  return files
    .sort((a, b) => b.size - a.size)
    .slice(0, count);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeBuild(buildPath) {
  log('\n📦 Analyzing Build Output...', 'blue');
  log(`   Path: ${buildPath}`, 'blue');

  if (!fs.existsSync(buildPath)) {
    log(`   ❌ Build path not found: ${buildPath}`, 'red');
    return null;
  }

  // Calculate sizes
  const jsSize = getDirectorySize(path.join(buildPath, '_next/static/chunks')) ||
                 getDirectorySize(path.join(buildPath, 'static/chunks'));

  const cssSize = getDirectorySize(path.join(buildPath, '_next/static/css')) ||
                  getDirectorySize(path.join(buildPath, 'static/css'));

  const totalSize = getDirectorySize(buildPath);

  // Find largest files
  const largestFiles = findLargestFiles(buildPath, 5);

  return {
    jsSize,
    cssSize,
    totalSize,
    largestFiles
  };
}

function main() {
  log('\n📊 Bundle Size Validation', 'blue');
  log('='.repeat(50), 'blue');

  const buildPath = process.argv[2] || path.join(__dirname, '../apps/booking/.open-next/assets');
  const limits = loadConfig();

  const analysis = analyzeBuild(buildPath);

  if (!analysis) {
    log('\n❌ Could not analyze build output', 'red');
    log('   Build path may not exist or be incorrectly specified', 'yellow');
    process.exit(1);
  }

  // Display results
  log('\n📏 Bundle Sizes:', 'blue');
  log(`   JavaScript: ${formatBytes(analysis.jsSize)}`, 'blue');
  log(`   CSS: ${formatBytes(analysis.cssSize)}`, 'blue');
  log(`   Total: ${formatBytes(analysis.totalSize)}`, 'blue');

  // Check against limits
  log('\n🎯 Checking Against Limits:', 'blue');

  const issues = [];

  if (analysis.jsSize > limits.mainJs) {
    log(`   ❌ JavaScript exceeds limit`, 'red');
    log(`      ${formatBytes(analysis.jsSize)} > ${formatBytes(limits.mainJs)}`, 'red');
    issues.push({ type: 'js', size: analysis.jsSize, limit: limits.mainJs });
  } else {
    log(`   ✅ JavaScript within limit (${formatBytes(analysis.jsSize)} ≤ ${formatBytes(limits.mainJs)})`, 'green');
  }

  if (analysis.cssSize > limits.css) {
    log(`   ❌ CSS exceeds limit`, 'red');
    log(`      ${formatBytes(analysis.cssSize)} > ${formatBytes(limits.css)}`, 'red');
    issues.push({ type: 'css', size: analysis.cssSize, limit: limits.css });
  } else {
    log(`   ✅ CSS within limit (${formatBytes(analysis.cssSize)} ≤ ${formatBytes(limits.css)})`, 'green');
  }

  if (analysis.totalSize > limits.totalPage) {
    log(`   ❌ Total size exceeds limit`, 'red');
    log(`      ${formatBytes(analysis.totalSize)} > ${formatBytes(limits.totalPage)}`, 'red');
    issues.push({ type: 'total', size: analysis.totalSize, limit: limits.totalPage });
  } else {
    log(`   ✅ Total size within limit (${formatBytes(analysis.totalSize)} ≤ ${formatBytes(limits.totalPage)})`, 'green');
  }

  // Show largest files
  if (analysis.largestFiles.length > 0) {
    log('\n📋 Largest Files:', 'blue');
    analysis.largestFiles.forEach((file, i) => {
      log(`   ${i + 1}. ${file.path} - ${formatBytes(file.size)}`, 'blue');
    });
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');

  if (issues.length === 0) {
    log('\n✅ All Bundle Sizes Within Limits!', 'green');
    log(`   Total size: ${formatBytes(analysis.totalSize)}`, 'green');
    process.exit(0);
  } else {
    log('\n❌ Bundle Size Validation Failed', 'red');
    log(`   ${issues.length} limit(s) exceeded`, 'red');
    log('\n   Consider:', 'yellow');
    log('   - Code splitting to reduce initial bundle size', 'yellow');
    log('   - Tree shaking unused dependencies', 'yellow');
    log('   - Lazy loading heavy components', 'yellow');
    log('   - Compressing images and assets', 'yellow');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeBuild, formatBytes };
