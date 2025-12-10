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
  google_access_token: text('google_access_token'),
  google_refresh_token: text('google_refresh_token'),
  google_token_expires_at: integer('google_token_expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('users_tenant_idx').on(table.tenantId),
  emailIdx: index('users_email_idx').on(table.email),
}));

// Appointments table (migrated from your current schema) with optimistic locking
export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  serviceId: text('service_id').notNull(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  employeeId: text('employee_id'), // SPEC: Employee assignments
  scheduledTime: integer('scheduled_time', { mode: 'timestamp' }).notNull(),
  status: text('status').default('pending'),
  notes: text('notes'),
  version: integer('version').notNull().default(1), // OPTIMISTIC LOCKING
  supersaasBookingId: text('supersaas_booking_id'), // SuperSaaS sync tracking
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('appointments_tenant_idx').on(table.tenantId),
  userIdx: index('users_appointment_idx').on(table.userId),
  scheduledIdx: index('appointments_scheduled_idx').on(table.scheduledTime),
}));

// Services table with SuperSaaS integration
export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  description: text('description'), // Added for UI
  durationMinutes: integer('duration_minutes').notNull(),
  price: integer('price'), // in cents
  supersaasServiceId: text('supersaas_service_id'), // SuperSaaS service ID
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('services_tenant_idx').on(table.tenantId),
}));

// Employees table for multi-employee scheduling
export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  email: text('email'), // For notifications
  supersaasScheduleId: text('supersaas_schedule_id'), // Individual schedule ID
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('employees_tenant_idx').on(table.tenantId),
}));

// Calendar Connections table for Google Calendar integration
export const calendarConnections = sqliteTable('calendar_connections', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  googleCalendarId: text('google_calendar_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  tokenExpiry: integer('token_expiry'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  syncSettings: text('sync_settings', { mode: 'json' }).$type<Record<string, any>>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('calendar_connections_tenant_idx').on(table.tenantId),
}));

// Calendar Sync Events table for tracking bookings synced to Google Calendar
export const calendarSyncEvents = sqliteTable('calendar_sync_events', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  bookingId: text('booking_id').notNull(),
  googleEventId: text('google_event_id'),
  syncStatus: text('sync_status').notNull(), // 'pending', 'created', 'updated', 'failed'
  errorMessage: text('error_message'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('calendar_sync_events_tenant_idx').on(table.tenantId),
  bookingIdx: index('calendar_sync_events_booking_idx').on(table.bookingId),
}));

// Analytics Events table for tracking business metrics and user interactions
export const analyticsEvents = sqliteTable('analytics_events', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  eventName: text('event_name').notNull(),
  properties: text('properties', { mode: 'json' }).$type<Record<string, any>>(),
  userId: text('user_id'), // Optional: link to authenticated users
  sessionId: text('session_id'), // For session tracking
  userAgent: text('user_agent'), // For device/browser tracking
  ipAddress: text('ip_address'), // For geo-analytics (ensure compliance)
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('analytics_events_tenant_idx').on(table.tenantId),
  eventIdx: index('analytics_events_event_idx').on(table.eventName),
  timestampIdx: index('analytics_events_timestamp_idx').on(table.timestamp),
}));

// AI Agent Logs table for tracking AI conversations and performance
export const aiAgentLogs = sqliteTable('ai_agent_logs', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  agentName: text('agent_name').notNull(), // 'Nia', 'AppointmentBot', etc.
  userId: text('user_id'), // Optional: link to users
  sessionId: text('session_id').notNull(),
  query: text('query').notNull(), // User input
  response: text('response').notNull(), // AI response
  responseTimeMs: integer('response_time_ms').notNull(), // Response time in ms
  resolved: integer('resolved', { mode: 'boolean' }).default(false), // Whether user issue was resolved
  escalated: integer('escalated', { mode: 'boolean' }).default(false), // Whether escalated to human
  satisfactionScore: integer('satisfaction_score'), // 1-5 scale (if collected)
  errorMessage: text('error_message'), // If AI failed
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('ai_agent_logs_tenant_idx').on(table.tenantId),
  agentIdx: index('ai_agent_logs_agent_idx').on(table.agentName),
  timestampIdx: index('ai_agent_logs_timestamp_idx').on(table.timestamp),
}));
