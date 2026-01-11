/**
 * Custom Test Sequencer
 * Determines the order in which tests are executed
 */

const { Sequencer } = require('@jest/test-sequencer');
const path = require('path');

class CustomTestSequencer extends Sequencer {
    /**
     * Sort tests to ensure deterministic execution order
     * Critical tests run first, then integration tests, then unit tests
     */
    sort(tests) {
        const testPath = tests[0].path;
        const dirname = path.dirname(testPath);

        // Priority order for test execution
        const priorityOrder = [
            'integration.test.ts',
            'booking-system.test.ts',
            'api-endpoints.test.ts',
            'performance.test.ts',
            'security.test.ts',
            'security-framework.test.ts',
            'test-setup.test.ts'
        ];

        return tests.sort((a, b) => {
            const aName = path.basename(a.path);
            const bName = path.basename(b.path);

            const aPriority = priorityOrder.indexOf(aName);
            const bPriority = priorityOrder.indexOf(bName);

            // If both tests are in priority order, maintain that order
            if (aPriority !== -1 && bPriority !== -1) {
                return aPriority - bPriority;
            }

            // If only one is in priority order, prioritize that one
            if (aPriority !== -1) return -1;
            if (bPriority !== -1) return 1;

            // Default alphabetical order for other tests
            return a.path.localeCompare(b.path);
        });
    }
}

module.exports = CustomTestSequencer;