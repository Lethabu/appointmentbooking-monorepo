const fs = require('fs');
const path = require('path');

function validateEnv(targetDir = '.') {
    const examplePath = path.join(targetDir, '.env.example');
    const envPath = path.join(targetDir, '.env');

    if (!fs.existsSync(examplePath)) {
        console.warn(`⚠️ No .env.example found in ${targetDir}. Skipping validation.`);
        return;
    }

    if (!fs.existsSync(envPath)) {
        console.error(`❌ Error: .env file not found in ${targetDir}`);
        process.exit(1);
    }

    const exampleContent = fs.readFileSync(examplePath, 'utf8');
    const envContent = fs.readFileSync(envPath, 'utf8');

    const getKeys = (content) => {
        return content
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#'))
            .map(line => line.split('=')[0].trim());
    };

    const exampleKeys = getKeys(exampleContent);
    const envKeys = getKeys(envContent);

    const missingKeys = exampleKeys.filter(key => !envKeys.includes(key));

    if (missingKeys.length > 0) {
        console.error(`❌ Validation failed in ${targetDir}. Missing keys in .env:`);
        missingKeys.forEach(key => console.error(`   - ${key}`));
        process.exit(1);
    }

    console.log(`✅ Environment validation passed for ${targetDir}`);
}

// Support optional target directory from CLI
const target = process.argv[2] || '.';
validateEnv(target);
