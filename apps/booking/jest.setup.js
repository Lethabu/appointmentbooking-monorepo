/**
 * Jest setup file for enterprise testing standards
 * Configures testing environment with mocks and utilities
 */

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        };
    },
    useSearchParams() {
        return new URLSearchParams();
    },
    usePathname() {
        return '/';
    },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        return <img {...props} />;
    },
}));

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
    createClientComponentClient: () => ({
        auth: {
            getUser: jest.fn(),
            signInWithPassword: jest.fn(),
            signOut: jest.fn(),
        },
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    data: [],
                    error: null,
                })),
            })),
        })),
    }),
}));

// Mock React icons
jest.mock('react-icons/fa', () => ({
    FaWhatsapp: () => <div data-testid="fa-whatsapp" />,
    FaTiktok: () => <div data-testid="fa-tiktok" />,
}));

// Mock performance monitoring
global.performance = {
    now: jest.fn(() => Date.now()),
};

// Mock fetch API
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
}));

// Setup testing utilities
beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset any global state
    document.body.innerHTML = '';
});

// Cleanup after each test
afterEach(() => {
    // Clean up any timers
    jest.clearAllTimers();
});

// Global test utilities
global.testUtils = {
    // Create a mock service
    createMockService: (overrides = {}) => ({
        id: 'service-1',
        name: 'Test Service',
        description: 'Test service description',
        price: 30000, // in cents
        duration_minutes: 60,
        ...overrides,
    }),

    // Create a mock product
    createMockProduct: (overrides = {}) => ({
        id: 'product-1',
        name: 'Test Product',
        description: 'Test product description',
        price: 15000, // in cents
        image_url: 'https://example.com/image.jpg',
        ...overrides,
    }),

    // Create a mock conversation
    createMockConversation: (overrides = {}) => ({
        id: 'conv-1',
        query: 'Test query',
        response: 'Test response',
        timestamp: Date.now(),
        resolved: true,
        ...overrides,
    }),

    // Mock form data
    createMockFormData: () => ({
        get: jest.fn(),
        getAll: jest.fn(),
        has: jest.fn(),
        set: jest.fn(),
        append: jest.fn(),
        delete: jest.fn(),
        entries: jest.fn(() => []),
        keys: jest.fn(() => []),
        values: jest.fn(() => []),
    }),
};

// Extend Jest matchers
expect.extend({
    toHaveBeenCalledWithA11yLabel(received, expectedLabel) {
        const calls = received.mock.calls;
        const hasA11yLabel = calls.some(call =>
            call[0]?.ariaLabel === expectedLabel ||
            call[0]?.['aria-label'] === expectedLabel
        );

        return {
            message: () => `expected function not to have been called with aria-label "${expectedLabel}"`,
            pass: hasA11yLabel,
        };
    },

    toBeAccessible(received) {
        const element = received;
        const hasRole = element.hasAttribute('role') || element.tagName.toLowerCase() === 'button' || element.tagName.toLowerCase() === 'input';
        const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby') || element.textContent?.trim();

        return {
            message: () => `expected element to be accessible (have role or label)`,
            pass: hasRole && hasLabel,
        };
    },
});