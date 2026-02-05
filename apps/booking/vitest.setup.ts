// Vitest Setup
// File: apps/booking/vitest.setup.ts

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock environment variables
process.env.NEXT_PUBLIC_TENANT_ID = 'test-tenant-id';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.AISENSY_API_KEY = 'test-aisensy-key';
process.env.CRON_SECRET = 'test-cron-secret';

// Fix URL parsing for API endpoints in jsdom environment
if (typeof global !== 'undefined' && !global.URL) {
    // Polyfill URL for jsdom
    global.URL = class URL {
        constructor(url, base) {
            if (base) {
                return new window.URL(url, base);
            }
            return new window.URL(url);
        }
    };
}

// Mock fetch for API testing
if (!global.fetch) {
    global.fetch = async (input, init) => {
        // Handle relative URLs by prepending base URL
        const url = typeof input === 'string'
            ? (input.startsWith('http') ? input : `http://localhost:3000${input}`)
            : input;

        return window.fetch(url, init);
    };
}

// Mock window.location for jsdom
if (typeof window !== 'undefined' && !window.location) {
    Object.defineProperty(window, 'location', {
        value: {
            href: 'http://localhost:3000',
            origin: 'http://localhost:3000',
            protocol: 'http:',
            host: 'localhost:3000',
            hostname: 'localhost',
            port: '3000',
            pathname: '/',
            search: '',
            hash: ''
        },
        writable: true
    });
}
