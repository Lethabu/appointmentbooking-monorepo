/**
 * Global Test Setup
 * Initializes test environment for all test suites
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.MICROSOFT_CLIENT_ID = 'test-microsoft-client-id';
process.env.MICROSOFT_CLIENT_SECRET = 'test-microsoft-client-secret';

// Mock console methods to reduce test noise
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Setup global test configuration
global.fetch = jest.fn();

// Increase timeout for integration tests
jest.setTimeout(30000);

// Setup test database connection (mock)
global.setupTestDB = async () => {
    // Mock database setup logic
    console.log('Setting up test database...');
};

// Cleanup after all tests
global.teardownTestDB = async () => {
    // Mock database cleanup logic
    console.log('Cleaning up test database...');
};

module.exports = async () => {
    await global.setupTestDB();
};