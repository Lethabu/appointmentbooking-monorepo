/**
 * Vitest Test Setup
 * Global setup for Vitest testing environment
 */

import { vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Extend global types
declare global {
    var setupTestEnvironment: () => {
        mockBookingData: {
            serviceId: string;
            date: string;
            time: string;
            staffId: string;
            customer: {
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
            };
        };
        mockAppointment: {
            id: string;
            status: string;
            scheduledTime: Date;
            customerId: string;
            serviceId: string;
            employeeId: string;
        };
    };
}

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.MICROSOFT_CLIENT_ID = 'test-microsoft-client-id';
process.env.MICROSOFT_CLIENT_SECRET = 'test-microsoft-client-secret';

// Mock global objects
global.fetch = vi.fn();
global.console = {
    ...console,
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
};

// Mock React components that might cause issues
vi.mock('react', () => ({
    useState: vi.fn(),
    useEffect: vi.fn(),
    useContext: vi.fn(),
    createContext: vi.fn(),
    Fragment: vi.fn(),
    forwardRef: vi.fn(),
    useRef: vi.fn(),
    useCallback: vi.fn(),
    useMemo: vi.fn(),
}));

// Mock Next.js modules
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    useSearchParams: vi.fn(),
    usePathname: vi.fn(),
}));

vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}));

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
        })),
        auth: {
            getSession: vi.fn(),
            getUser: vi.fn(),
        },
    })),
}));

// Setup MSW server for API mocking
export const server = setupServer(
    // Default handlers
    http.get('*/api/health', () => {
        return HttpResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
    }),

    // Mock booking endpoints
    http.post('*/api/bookings', async ({ request }) => {
        return HttpResponse.json({
            success: true,
            data: {
                appointment: {
                    id: 'test-appointment-id',
                    status: 'confirmed',
                    createdAt: new Date().toISOString(),
                }
            }
        });
    }),

    // Mock availability endpoints
    http.get('*/api/availability', async ({ request }) => {
        return HttpResponse.json({
            success: true,
            data: {
                slots: [
                    {
                        start: '2026-01-15T09:00:00.000Z',
                        end: '2026-01-15T10:00:00.000Z',
                        isAvailable: true,
                        employeeId: 'staff-1',
                    }
                ]
            }
        });
    }),

    // Mock calendar endpoints
    http.get('*/api/google-calendar/oauth', () => {
        return HttpResponse.redirect('https://accounts.google.com/oauth/authorize?client_id=test');
    }),

    http.get('*/api/google-calendar/status', () => {
        return HttpResponse.json({
            success: true,
            data: {
                connected: false,
                calendars: [],
            }
        });
    }),
);

// Start server before all tests
beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
});

// Clean up after each test
afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
    server.close();
});

// Global test utilities
global.setupTestEnvironment = () => {
    // Reset all mocks
    vi.clearAllMocks();

    // Set up test data
    return {
        mockBookingData: {
            serviceId: 'service-1',
            date: '2026-01-15',
            time: '14:00',
            staffId: 'staff-1',
            customer: {
                firstName: 'Test',
                lastName: 'Customer',
                email: 'test@example.com',
                phone: '+27123456789',
            }
        },
        mockAppointment: {
            id: 'apt-123',
            status: 'confirmed',
            scheduledTime: new Date('2026-01-15T14:00:00.000Z'),
            customerId: 'cust-123',
            serviceId: 'service-1',
            employeeId: 'staff-1',
        }
    };
};