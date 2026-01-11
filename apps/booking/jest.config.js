/**
 * Jest Configuration for Comprehensive Testing
 * Unified test configuration for all testing types
 */

module.exports = {
    // Test environment
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost'
    },

    // Test files patterns
    testMatch: [
        '<rootDir>/tests/**/*.test.ts',
        '<rootDir>/tests/**/*.test.js',
        '<rootDir>/tests/**/*.spec.ts',
        '<rootDir>/tests/**/*.spec.js'
    ],

    // Module file extensions
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ],

    // Module name mapping
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@repo/(.*)$': '<rootDir>/../packages/$1'
    },

    // Transform configuration
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: {
                    target: 'es2020',
                    lib: ['dom', 'dom.iterable', 'esnext'],
                    allowJs: true,
                    skipLibCheck: true,
                    strict: true,
                    noEmit: true,
                    esModuleInterop: true,
                    module: 'esnext',
                    moduleResolution: 'node',
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noUnusedLocals: false,
                    noUnusedParameters: false,
                    noFallthroughCasesInSwitch: true
                }
            }
        ],
        '^.+\\.(js|jsx)$': 'babel-jest'
    },

    // Coverage configuration
    collectCoverage: true,
    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'utils/**/*.{ts,tsx}',
        'services/**/*.{ts,tsx}',
        '!app/**/*.d.ts',
        '!components/**/*.d.ts',
        '!lib/**/*.d.ts',
        '!utils/**/*.d.ts',
        '!services/**/*.d.ts',
        '!**/*.test.{ts,tsx}',
        '!**/*.spec.{ts,tsx}',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: [
        'text',
        'text-summary',
        'html',
        'lcov',
        'json'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        },
        // Higher thresholds for critical components
        './app/api/': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        },
        './services/': {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85
        },
        './utils/': {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85
        }
    },

    // Test timeout
    testTimeout: 30000,

    // Parallel testing
    maxWorkers: '50%',

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,
    restoreMocks: true,

    // Error handling
    errorOnDeprecated: true,

    // Test result processing
    reporters: [
        'default',
        [
            'jest-html-reporters',
            {
                publicPath: './test-reports',
                filename: 'test-report.html',
                expand: true,
                hideIcon: false,
                pageTitle: 'Booking System Test Report'
            }
        ],
        [
            'jest-junit',
            {
                outputDirectory: './test-reports',
                outputName: 'junit.xml',
                suiteName: 'Booking System Tests'
            }
        ]
    ],

    // Global test setup and teardown
    globalSetup: '<rootDir>/tests/setup/global-setup.js',
    globalTeardown: '<rootDir>/tests/setup/global-teardown.js',

    // Ignore patterns
    testPathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
        '<rootDir>/coverage/',
        '<rootDir>/test-reports/',
        '<rootDir>/dist/',
        '<rootDir>/build/'
    ],

    // Module paths to ignore
    modulePathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
        '<rootDir>/coverage/',
        '<rootDir>/test-reports/'
    ],

    // TestSequencer for custom test ordering - using default for now
    // testSequencer: '<rootDir>/tests/setup/test-sequencer.js',

    // Custom matchers
    setupFilesAfterEnv: [
        '<rootDir>/tests/setup/custom-matchers.js'
    ],

    // Environment variables for tests
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons']
    },

    // Maximum workers for CI environments
    maxWorkers: process.env.CI ? 2 : '50%',

    // Detect open handles in tests (helps with cleanup)
    detectOpenHandles: true,

    // Force exit after tests complete
    forceExit: true,

    // Reset module registry between tests
    resetModules: true,

    // Run tests in random order
    randomize: true,

    // Additional coverage reporter
    reporters: [
        'default',
        [
            'jest-html-reporters',
            {
                publicPath: './test-reports',
                filename: 'test-report.html',
                expand: true,
                hideIcon: false,
                pageTitle: 'Booking System Test Report'
            }
        ],
        [
            'jest-junit',
            {
                outputDirectory: './test-reports',
                outputName: 'junit.xml',
                suiteName: 'Booking System Tests'
            }
        ],
        [
            './tests/setup/coverage-reporter.js',
            {
                outputDirectory: './coverage',
                outputName: 'coverage-summary.json'
            }
        ]
    ]
};