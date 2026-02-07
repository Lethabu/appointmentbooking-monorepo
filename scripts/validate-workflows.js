#!/usr/bin/env node

/**
 * Workflow Validation Script
 * 
 * This script validates that all the scripts referenced in GitHub Actions workflows exist
 * and that the workflows are properly configured.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating GitHub Actions Workflows\n');
console.log('=' .repeat(50));

const workflowsDir = path.join(__dirname, '..', '.github', 'workflows');
const packageJson = require(path.join(__dirname, '..', 'package.json'));

let hasErrors = false;
let hasWarnings = false;

// Get all workflow files
const workflowFiles = fs.readdirSync(workflowsDir)
  .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
  .filter(f => f !== 'README.md');

console.log(`\nFound ${workflowFiles.length} workflow files:\n`);

workflowFiles.forEach(file => {
  console.log(`\n📄 ${file}`);
  console.log('-'.repeat(50));
  
  const workflowPath = path.join(workflowsDir, file);
  const content = fs.readFileSync(workflowPath, 'utf8');
  
  try {
    // Extract workflow name
    const nameMatch = content.match(/^name:\s*(.+)$/m);
    if (nameMatch) {
      console.log(`   Name: ${nameMatch[1]}`);
    } else {
      console.warn('   ⚠️  No workflow name defined');
      hasWarnings = true;
    }
    
    // Extract and validate scripts referenced in the workflow
    const scriptReferences = [];
    const secretReferences = [];
    
    // Find pnpm run commands
    const scriptMatches = content.matchAll(/pnpm run ([a-z:_-]+)/gi);
    for (const match of scriptMatches) {
      scriptReferences.push(match[1]);
    }
    
    // Find secret references
    const secretMatches = content.matchAll(/secrets\.([A-Z_]+)/gi);
    for (const match of secretMatches) {
      secretReferences.push(match[1]);
    }
    
    // Validate scripts exist in package.json
    if (scriptReferences.length > 0) {
      const uniqueScripts = [...new Set(scriptReferences)];
      console.log(`\n   Referenced scripts (${uniqueScripts.length}):`);
      
      uniqueScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
          console.log(`   ✅ ${script}`);
        } else {
          console.log(`   ⚠️  ${script} - NOT FOUND in package.json (may be optional)`);
          hasWarnings = true;
        }
      });
    }
    
    // List secrets (informational)
    if (secretReferences.length > 0) {
      const uniqueSecrets = [...new Set(secretReferences)];
      console.log(`\n   Referenced secrets (${uniqueSecrets.length}):`);
      uniqueSecrets.forEach(secret => {
        console.log(`   🔑 ${secret}`);
      });
    }
    
    // Check for required files referenced in scripts
    const fileReferences = content.matchAll(/node scripts\/([a-z-]+\.js)/gi);
    const missingFiles = [];
    for (const match of fileReferences) {
      const scriptFile = path.join(__dirname, '..', 'scripts', match[1]);
      if (!fs.existsSync(scriptFile)) {
        missingFiles.push(match[1]);
      }
    }
    
    if (missingFiles.length > 0) {
      console.log(`\n   Missing script files (${missingFiles.length}):`);
      missingFiles.forEach(file => {
        console.log(`   ❌ scripts/${file}`);
      });
      hasErrors = true;
    }
    
  } catch (error) {
    console.error(`   ❌ Error parsing workflow: ${error.message}`);
    hasErrors = true;
  }
});

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('\n❌ Validation failed with errors');
  console.log('Please fix the issues above before running workflows.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  Validation passed with warnings');
  console.log('Consider addressing the warnings above.\n');
  process.exit(0);
} else {
  console.log('\n✅ All workflows validated successfully!\n');
  process.exit(0);
}
