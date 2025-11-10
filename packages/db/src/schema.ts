import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tenants table (migrated from your SQL)
export const tenants = sqliteTable('tenants', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name'),
  hostnames: text('hostnames', { mode: 'json' }).$type<string[]>(),
  config: text('config', { mode: 'json' }).$type<Record<string, any>>(),
  salonId: text('salon_id'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  slugIdx: index('tenants_slug_idx').on(table.slug),
}));

// Users table with tenant isolation
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  role: text('role').default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('users_tenant_idx').on(table.tenantId),
  emailIdx: index('users_email_idx').on(table.email),
}));

// Appointments table (migrated from your current schema)
export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  serviceId: text('service_id').notNull(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  scheduledTime: integer('scheduled_time', { mode: 'timestamp' }).notNull(),
  status: text('status').default('pending'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('appointments_tenant_idx').on(table.tenantId),
  userIdx: index('users_appointment_idx').on(table.userId),
  scheduledIdx: index('appointments_scheduled_idx').on(table.scheduledTime),
}));

// Services table
export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  price: integer('price'), // in cents
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
}, (table) => ({
  tenantIdx: index('services_tenant_idx').on(table.tenantId),
}));
