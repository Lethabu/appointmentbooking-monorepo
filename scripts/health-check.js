#!/usr/bin/env node
/**
 * Health Check Script for Appointment Booking System
 * Used by Dockerfile.prod for container health checks
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const ENDPOINTS = ['/api/health', '/health', '/'];
const TIMEOUT_MS = 5000;

async function checkEndpoint(hostname, port, path) {
    return new Promise((resolve) => {
        const req = http.get(`http://${hostname}:${port}${path}`, { timeout: TIMEOUT_MS }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({
                    path,
                    status: res.statusCode,
                    success: res.statusCode >= 200 && res.statusCode < 400,
                    data: data.substring(0, 100)
                });
            });
        });

        req.on('error', (err) => {
            resolve({
                path,
                status: 0,
                success: false,
                error: err.message
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                path,
                status: 0,
                success: false,
                error: 'timeout'
            });
        });
    });
}

async function runHealthCheck() {
    let allHealthy = true;
    const results = [];

    for (const endpoint of ENDPOINTS) {
        const result = await checkEndpoint(HOSTNAME, PORT, endpoint);
        results.push(result);

        if (!result.success) {
            allHealthy = false;
        }
    }

    console.log('=== Health Check Results ===');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Target: http://${HOSTNAME}:${PORT}`);

    for (const result of results) {
        const statusIcon = result.success ? '✓' : '✗';
        console.log(`${statusIcon} ${result.path}: ${result.status || 'ERROR'} ${result.error ? `(${result.error})` : ''}`);
    }

    if (allHealthy) {
        console.log('Status: HEALTHY');
        process.exit(0);
    } else {
        console.log('Status: UNHEALTHY');
        process.exit(1);
    }
}

// Run health check
runHealthCheck().catch((err) => {
    console.error('Health check failed:', err.message);
    process.exit(1);
});
