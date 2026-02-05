// Vitest Configuration
// File: apps/booking/vitest.config.ts

import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup/vitest.setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                '.next/',
                'e2e/',
                '**/*.config.*',
                '**/*.test.*',
                '**/__tests__/**',
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
        // Fix URL parsing for API endpoints
        server: {
            deps: {
                inline: ['msw']
            }
        },
        // Configure fetch polyfill for API testing
        environmentOptions: {
            url: 'http://localhost:3000'
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});
