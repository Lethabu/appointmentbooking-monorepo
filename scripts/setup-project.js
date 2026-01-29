const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Appointment Booking Project Setup...');

function run(command) {
    try {
        console.log(`\n🏃 Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Failed: ${command}`);
        process.exit(1);
    }
}

// 1. Install dependencies
run('pnpm install');

// 2. Initialize .env if not exists
const apps = ['apps/booking', 'apps/dashboard', 'apps/marketing'];
apps.forEach(app => {
    const envPath = path.join(app, '.env');
    const examplePath = path.join(app, '.env.example');

    if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
        console.log(`📦 Creating .env for ${app}...`);
        fs.copyFileSync(examplePath, envPath);
    }
});

// 3. Setup git hooks
run('pnpm run setup:hooks');

// 4. Validate configuration
run('pnpm run build --filter booking --dry');

console.log('\n✨ Setup complete! Happy coding.');
