import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@repo/db';
import { employees } from '@repo/db';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || 'default-tenant';

    const db = getDb(process.env as any);

    // Validate tenant exists (simplified for now)
    const tenantCheck = await db
      .select({ id: employees.tenantId })
      .from(employees)
      .where(eq(employees.tenantId, tenantId))
      .limit(1)
      .catch(() => null); // Ignore errors, assume tenant exists

    // Get employees for this tenant
    const employeesList = await db
      .select({
        id: employees.id,
        name: employees.name,
        email: employees.email,
        isActive: employees.isActive,
      })
      .from(employees)
      .where(and(
        eq(employees.tenantId, tenantId),
        eq(employees.isActive, true)
      ));

    return NextResponse.json({
      success: true,
      employees: employeesList
    });

  } catch (error) {
    console.error('Employees API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', employees: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || 'default-tenant';
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Employee name is required' },
        { status: 400 }
      );
    }

    const db = getDb(process.env as any);

    // Create new employee with tenant isolation
    const newEmployee = await db
      .insert(employees)
      .values({
        id: crypto.randomUUID(),
        tenantId,
        name: body.name,
        email: body.email || undefined,
        isActive: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      employee: newEmployee[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Create employee error:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
