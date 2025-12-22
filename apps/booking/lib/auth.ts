import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, PERMISSIONS, requirePermission, requireAnyPermission } from '@repo/auth';
import { db } from './db';
import { tenants } from '@repo/db/schema';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  userId: string;
  email: string;
  tenantId: string;
  permissions: string[];
  roles: string[];
}

async function getTenantIdFromSlug(slug: string): Promise<string | null> {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.slug, slug),
    columns: {
      id: true,
    },
  });
  return tenant?.id || null;
}

export async function getCurrentUser(tenantSlug: string): Promise<AuthUser | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const tenantId = await getTenantIdFromSlug(tenantSlug);
  if (!tenantId) {
    return null;
  }

  const email = user.emailAddresses[0]?.emailAddress || '';
  const userPerms = await getUserPermissions(db, userId, tenantId);

  return {
    userId,
    email,
    tenantId,
    permissions: userPerms.permissions,
    roles: userPerms.roles,
  };
}

export function requireAdmin(tenantSlug: string, requestHandler: (request: NextRequest, authUser: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authUser = await getCurrentUser(tenantSlug);
    if (!authUser) {
      return new NextResponse('Authentication required', { status: 401 });
    }

    try {
      await requirePermission(db, PERMISSIONS.SYSTEM_ADMIN)(request, { userId: authUser.userId, tenantId: authUser.tenantId });
    } catch (error: any) {
      if (error instanceof NextResponse) {
        return error; // Re-throw the unauthorized/forbidden response from requirePermission
      }
      return new NextResponse('Internal Server Error', { status: 500 });
    }
    return requestHandler(request, authUser);
  };
}

export function requireCustomerOrAdmin(tenantSlug: string, requestHandler: (request: NextRequest, authUser: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authUser = await getCurrentUser(tenantSlug);
    if (!authUser) {
      return new NextResponse('Authentication required', { status: 401 });
    }

    try {
      await requireAnyPermission(db, [PERMISSIONS.APPOINTMENT_CREATE, PERMISSIONS.SYSTEM_ADMIN])(request, { userId: authUser.userId, tenantId: authUser.tenantId });
    } catch (error: any) {
      if (error instanceof NextResponse) {
        return error; // Re-throw the unauthorized/forbidden response from requireAnyPermission
      }
      return new NextResponse('Internal Server Error', { status: 500 });
    }
    return requestHandler(request, authUser);
  };
}
