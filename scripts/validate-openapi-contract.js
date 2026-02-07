#!/usr/bin/env node

/**
 * OpenAPI Contract Validator
 *
 * Validates that the Cloudflare Worker implementation matches the OpenAPI specification.
 * This ensures all endpoints defined in the spec are implemented and properly configured.
 *
 * Exit codes:
 * - 0: All validations passed
 * - 1: Validation failures detected
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const OPENAPI_SPEC_PATH = path.join(__dirname, '../packages/worker/docs/openapi.yaml');
const WORKER_SRC_PATH = path.join(__dirname, '../packages/worker/src');

// Color codes for terminal output
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

function parseOpenAPISpec() {
  try {
    const specContent = fs.readFileSync(OPENAPI_SPEC_PATH, 'utf8');
    const spec = yaml.parse(specContent);
    return spec;
  } catch (error) {
    log(`Error parsing OpenAPI spec: ${error.message}`, 'red');
    process.exit(1);
  }
}

function extractEndpointsFromSpec(spec) {
  const endpoints = [];

  if (!spec || !spec.paths) {
    log('No paths found in OpenAPI spec', 'yellow');
    return endpoints;
  }

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, definition] of Object.entries(methods)) {
      if (method === 'parameters' || method === 'description') continue;

      endpoints.push({
        path,
        method: method.toUpperCase(),
        operationId: definition.operationId || `${method}_${path}`,
        isPublic: !definition.security || definition.security.length === 0 ||
                  definition.security.some(sec => Object.keys(sec).length === 0),
        tags: definition.tags || [],
        summary: definition.summary || ''
      });
    }
  }

  return endpoints;
}

function extractEndpointsFromWorker(workerSrcPath) {
  const endpoints = [];

  try {
    const indexPath = path.join(workerSrcPath, 'index.ts');
    if (!fs.existsSync(indexPath)) {
      log(`Worker index file not found at ${indexPath}`, 'yellow');
      return endpoints;
    }

    const content = fs.readFileSync(indexPath, 'utf8');

    // Extract route patterns - common patterns in Cloudflare Workers
    const patterns = [
      /if\s*\(\s*path\s*===?\s*['"`]([^'"`]+)['"`]\s*(?:&&\s*request\.method\s*===?\s*['"`](\w+)['"`])?\)/g,
      /if\s*\(\s*request\.method\s*===?\s*['"`](\w+)['"`]\s*&&\s*path\s*===?\s*['"`]([^'"`]+)['"`]\)/g,
      /if\s*\(\s*path\.startsWith\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      /if\s*\(\s*path\.match\s*\(\s*\/([^\/]+)\/\s*\)/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (pattern.source.includes('startsWith')) {
          // Handle startsWith patterns
          const basePath = match[1];
          endpoints.push({
            path: basePath,
            method: 'UNKNOWN',
            source: 'worker'
          });
        } else if (pattern.source.includes('request\\.method')) {
          // Handle method-first patterns
          endpoints.push({
            path: match[2] || match[1],
            method: (match[1] || match[2] || 'GET').toUpperCase(),
            source: 'worker'
          });
        } else {
          // Handle path-first patterns
          endpoints.push({
            path: match[1],
            method: (match[2] || 'GET').toUpperCase(),
            source: 'worker'
          });
        }
      }
    });

    return endpoints;
  } catch (error) {
    log(`Error parsing worker source: ${error.message}`, 'yellow');
    return endpoints;
  }
}

function normalizeEndpoint(endpoint) {
  // Normalize path parameters {id} -> :id or remove them for comparison
  let normalizedPath = endpoint.path
    .replace(/\{([^}]+)\}/g, ':$1') // OpenAPI {id} -> :id
    .replace(/\/$/, ''); // Remove trailing slash

  return {
    path: normalizedPath,
    method: endpoint.method.toUpperCase()
  };
}

function compareEndpoints(specEndpoints, workerEndpoints) {
  const issues = [];
  const implemented = new Set();

  log('\n📋 Validating OpenAPI Contract Compliance...', 'blue');
  log('=' .repeat(50), 'blue');

  // Check each spec endpoint is implemented
  specEndpoints.forEach(specEndpoint => {
    const normalized = normalizeEndpoint(specEndpoint);
    const key = `${normalized.method} ${normalized.path}`;

    // Look for matching implementation
    const found = workerEndpoints.some(workerEndpoint => {
      const workerNormalized = normalizeEndpoint(workerEndpoint);
      const workerKey = `${workerNormalized.method} ${workerNormalized.path}`;

      // Exact match or prefix match (for paths with parameters)
      const isMatch = workerKey === key ||
                     normalized.path.startsWith(workerNormalized.path) ||
                     workerNormalized.path.startsWith(normalized.path);

      if (isMatch) {
        implemented.add(key);
        return true;
      }
      return false;
    });

    if (!found) {
      issues.push({
        type: 'missing',
        endpoint: key,
        details: specEndpoint
      });
      log(`❌ Missing: ${key}`, 'red');
      log(`   Operation: ${specEndpoint.operationId || 'N/A'}`, 'yellow');
      log(`   Summary: ${specEndpoint.summary || 'N/A'}`, 'yellow');
    } else {
      log(`✅ Implemented: ${key}`, 'green');
    }
  });

  // Check for extra endpoints not in spec (informational only)
  workerEndpoints.forEach(workerEndpoint => {
    const normalized = normalizeEndpoint(workerEndpoint);
    const key = `${normalized.method} ${normalized.path}`;

    if (!implemented.has(key) && !key.includes('UNKNOWN')) {
      const inSpec = specEndpoints.some(specEndpoint => {
        const specNormalized = normalizeEndpoint(specEndpoint);
        const specKey = `${specNormalized.method} ${specNormalized.path}`;
        return specKey === key ||
               normalized.path.startsWith(specNormalized.path) ||
               specNormalized.path.startsWith(normalized.path);
      });

      if (!inSpec) {
        log(`⚠️  Extra endpoint (not in spec): ${key}`, 'yellow');
      }
    }
  });

  return issues;
}

function main() {
  log('\n🔍 OpenAPI Contract Validation', 'blue');
  log('='.repeat(50), 'blue');

  // Parse OpenAPI spec
  log('\n📖 Parsing OpenAPI specification...', 'blue');
  const spec = parseOpenAPISpec();
  const specEndpoints = extractEndpointsFromSpec(spec);
  log(`   Found ${specEndpoints.length} endpoints in OpenAPI spec`, 'green');

  // Parse Worker implementation
  log('\n📝 Parsing Worker implementation...', 'blue');
  const workerEndpoints = extractEndpointsFromWorker(WORKER_SRC_PATH);
  log(`   Found ${workerEndpoints.length} route handlers in Worker`, 'green');

  // Compare and validate
  const issues = compareEndpoints(specEndpoints, workerEndpoints);

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  if (issues.length === 0) {
    log('✅ All OpenAPI endpoints are implemented!', 'green');
    log(`   Validated ${specEndpoints.length} endpoints`, 'green');
    process.exit(0);
  } else {
    log(`❌ Found ${issues.length} contract compliance issues`, 'red');
    log('\nContract Validation Failed!', 'red');
    log('Please ensure all OpenAPI endpoints are implemented in the Worker.', 'yellow');
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = { parseOpenAPISpec, extractEndpointsFromSpec, compareEndpoints };
