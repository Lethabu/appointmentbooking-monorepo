import { NextRequest } from 'next/server';

// User type for RBAC system
interface User {
    id: string;
    role?: string;
    email?: string;
    name?: string;
}

/**
 * Role-Based Access Control (RBAC) System
 * Provides granular permission checking for the booking system
 */

export type Role = 'admin' | 'staff' | 'customer' | 'guest';

// Granular permissions
export type Permission =
    // User Management
    | 'users:read'
    | 'users:write'
    | 'users:delete'

    // Booking Management
    | 'bookings:read_own'
    | 'bookings:read_all'
    | 'bookings:create'
    | 'bookings:update_own'
    | 'bookings:update_all'
    | 'bookings:cancel_own'
    | 'bookings:cancel_all'

    // Service Management
    | 'services:read'
    | 'services:write'

    // Financial
    | 'payments:read'
    | 'payments:refund'
    | 'analytics:read'

    // System
    | 'system:config'
    | 'logs:read';

// Role Definition Map
export const RolePermissions: Record<Role, Permission[]> = {
    admin: [
        'users:read', 'users:write', 'users:delete',
        'bookings:read_all', 'bookings:create', 'bookings:update_all', 'bookings:cancel_all',
        'services:read', 'services:write',
        'payments:read', 'payments:refund', 'analytics:read',
        'system:config', 'logs:read'
    ],
    staff: [
        'users:read',
        'bookings:read_all', 'bookings:create', 'bookings:update_all', 'bookings:cancel_all',
        'services:read',
        'payments:read'
    ],
    customer: [
        'bookings:read_own', 'bookings:create', 'bookings:update_own', 'bookings:cancel_own',
        'services:read',
        'payments:read' // Own payments implicitly
    ],
    guest: [
        'services:read',
        'bookings:create' // Guest checkout flow
    ]
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    const permissions = RolePermissions[role];
    return permissions ? permissions.includes(permission) : false;
}

/**
 * Get user role from session or default to guest
 * Simplified for production build compatibility
 */
export async function getUserRole(req: NextRequest): Promise<Role> {
    // For now, default to customer role
    // In production, this would integrate with your auth system
    const authHeader = req.headers.get('authorization');

    if (!authHeader) return 'guest';

    // Default to customer for authenticated requests
    return 'customer';
}

/**
 * Authorization Helper for API Routes
 * @example
 * const authorized = await authorize(req, 'bookings:read_all');
 * if (!authorized) return new Response('Unauthorized', { status: 403 });
 */
export async function authorize(req: NextRequest, requiredPermission: Permission): Promise<boolean> {
    const role = await getUserRole(req);
    return hasPermission(role, requiredPermission);
}

/**
 * Middleware wrapper for RBAC
 */
export function withPermission(permission: Permission, handler: Function) {
    return async (req: NextRequest, ...args: any[]) => {
        const isAuthorized = await authorize(req, permission);

        if (!isAuthorized) {
            // Check for Service-to-Service internal secret override
            const internalSecret = req.headers.get('x-internal-secret');
            if (internalSecret === process.env.INTERNAL_SERVICE_KEY) {
                return handler(req, ...args);
            }

            return new Response(JSON.stringify({
                error: 'Forbidden',
                message: `Missing required permission: ${permission}`
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return handler(req, ...args);
    };
}
