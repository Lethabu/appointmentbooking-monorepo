/**
 * Global Test Teardown
 * Cleans up after all test suites complete
 */

module.exports = async () => {
    // Clean up any global test resources
    console.log('Running global test teardown...');

    // Clear any global mocks
    jest.clearAllMocks();

    // Cleanup test database if needed
    if (global.teardownTestDB) {
        await global.teardownTestDB();
    }

    // Reset any global state
    global.fetch = undefined;
};