import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tenants table (migrated from your SQL)
export const tenants = sqliteTable('tenants', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name'),
  hostnames: text('hostnames', { mode: 'json' }).$type<string[]>(),
  config: text('config', { mode: 'json' }).$type<Record<string, any>>(),
  currency: text('currency').default('ZAR'), // Added for multi-currency support
  paymentConfig: text('payment_config', { mode: 'json' }).$type<Record<string, any>>(), // Added for payment gateways
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

// Notifications table for system/email/push messages (migrated from legacy)
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  userId: text('user_id').notNull().references(() => users.id),
  appointmentId: text('appointment_id').references(() => appointments.id),
  type: text('type').notNull(), // 'confirmation', 'reminder', 'cancellation', 'update'
  channel: text('channel').notNull(), // 'email', 'sms', 'whatsapp', 'push'
  recipient: text('recipient').notNull(), // Email address or phone number
  message: text('message').notNull(),
  status: text('status').default('pending'), // 'pending', 'sent', 'failed', 'delivered'
  sentAt: integer('sent_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('notifications_tenant_idx').on(table.tenantId),
  userIdx: index('notifications_user_idx').on(table.userId),
  appointmentIdx: index('notifications_appointment_idx').on(table.appointmentId),
  statusIdx: index('notifications_status_idx').on(table.status),
}));

// Ecommerce Tables for Salon Product Sales

// Products table for salon merchandise and services
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // in cents
  category: text('category'), // 'merchandise', 'service', 'package'
  imageUrl: text('image_url'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  inventoryCount: integer('inventory_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('products_tenant_idx').on(table.tenantId),
  categoryIdx: index('products_category_idx').on(table.category),
}));

// Shopping cart for temporary storage
export const cartItems = sqliteTable('cart_items', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull().default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  userIdx: index('cart_items_user_idx').on(table.userId),
  tenantIdx: index('cart_items_tenant_idx').on(table.tenantId),
}));

// Orders table for completed purchases
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  userId: text('user_id').notNull().references(() => users.id),
  totalAmount: integer('total_amount').notNull(), // in cents
  status: text('status').default('pending'), // 'pending', 'paid', 'fulfilled', 'cancelled'
  paymentMethod: text('payment_method'), // 'paystack', 'card', etc.
  paymentReference: text('payment_reference'),
  shippingAddress: text('shipping_address', { mode: 'json' }).$type<Record<string, any>>(),
  orderItems: text('order_items', { mode: 'json' }).$type<Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('orders_tenant_idx').on(table.tenantId),
  userIdx: index('orders_user_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
}));

// WhatsApp integration tables
export const whatsappMessages = sqliteTable('whatsapp_messages', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  phoneNumber: text('phone_number').notNull(),
  messageType: text('message_type').notNull(), // 'incoming', 'outgoing'
  content: text('content').notNull(),
  messageId: text('message_id'), // WhatsApp message ID
  status: text('status').default('sent'), // 'sent', 'delivered', 'read', 'failed'
  appointmentId: text('appointment_id'), // Link to booking
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('whatsapp_messages_tenant_idx').on(table.tenantId),
  phoneIdx: index('whatsapp_messages_phone_idx').on(table.phoneNumber),
  appointmentIdx: index('whatsapp_messages_appointment_idx').on(table.appointmentId),
}));

// Automated campaigns for marketing
export const marketingCampaigns = sqliteTable('marketing_campaigns', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'reminder', 'promotion', 'followup'
  messageTemplate: text('message_template').notNull(),
  targetAudience: text('target_audience'), // 'all', 'new_clients', 'returning'
  scheduleType: text('schedule_type'), // 'immediate', 'scheduled', 'recurring'
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('marketing_campaigns_tenant_idx').on(table.tenantId),
  typeIdx: index('marketing_campaigns_type_idx').on(table.type),
}));

// ========================================
// ROLE-BASED ACCESS CONTROL (RBAC) SYSTEM
// ========================================

// Permission definitions enum
export const PermissionType = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLES: 'user:manage_roles',

  // Appointment Management
  APPOINTMENT_CREATE: 'appointment:create',
  APPOINTMENT_READ: 'appointment:read',
  APPOINTMENT_UPDATE: 'appointment:update',
  APPOINTMENT_DELETE: 'appointment:delete',
  APPOINTMENT_MANAGE_ALL: 'appointment:manage_all',

  // Service Management
  SERVICE_CREATE: 'service:create',
  SERVICE_READ: 'service:read',
  SERVICE_UPDATE: 'service:update',
  SERVICE_DELETE: 'service:delete',

  // Product Management
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  PRODUCT_INVENTORY: 'product:inventory',

  // Analytics & Reporting
  ANALYTICS_VIEW: 'analytics:view',
  REPORTS_EXPORT: 'reports:export',
  DASHBOARD_VIEW: 'dashboard:view',

  // System Administration
  SETTINGS_UPDATE: 'settings:update',
  TENANT_MANAGE: 'tenant:manage',
  BILLING_MANAGE: 'billing:manage',

  // Marketing & Communication
  MARKETING_SEND: 'marketing:send',
  NOTIFICATIONS_MANAGE: 'notifications:manage',

  // Full System Access (Admin only)
  SYSTEM_ADMIN: '*'
} as const;

// Roles table - defines permission sets per tenant
export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  permissions: text('permissions', { mode: 'json' }).$type<string[]>().default([]),
  isSystemRole: integer('is_system_role', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('roles_tenant_idx').on(table.tenantId),
  nameIdx: index('roles_name_idx').on(table.name),
  systemIdx: index('roles_system_idx').on(table.isSystemRole),
}));

// User-Role junction table - assigns roles to users
export const userRoles = sqliteTable('user_roles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  assignedBy: text('assigned_by').references(() => users.id),
  assignedAt: integer('assigned_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  expiresAt: integer('expires_at', { mode: 'timestamp' }), // Optional role expiration
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
}, (table) => ({
  userIdx: index('user_roles_user_idx').on(table.userId),
  roleIdx: index('user_roles_role_idx').on(table.roleId),
  compositeIdx: index('user_roles_composite_idx').on(table.userId, table.roleId),
}));

// Role permission audit log - tracks permission changes
export const roleAuditLog = sqliteTable('role_audit_log', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id), // User who made the change
  action: text('action').notNull(), // 'create', 'update', 'delete', 'assign', 'revoke'
  resourceType: text('resource_type').notNull(), // 'role', 'user_role', 'permission'
  resourceId: text('resource_id').notNull(),
  oldValue: text('old_value', { mode: 'json' }),
  newValue: text('new_value', { mode: 'json' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('role_audit_tenant_idx').on(table.tenantId),
  userIdx: index('role_audit_user_idx').on(table.userId),
  actionIdx: index('role_audit_action_idx').on(table.action),
  resourceIdx: index('role_audit_resource_idx').on(table.resourceType, table.resourceId),
}));

// Default role templates for new tenants
export const defaultRoles = {
  admin: {
    name: 'Administrator',
    description: 'Full system access and management',
    permissions: [
      PermissionType.SYSTEM_ADMIN,
      PermissionType.USER_MANAGE_ROLES,
      PermissionType.TENANT_MANAGE,
      PermissionType.BILLING_MANAGE
    ]
  },

  staff: {
    name: 'Staff',
    description: 'Operational staff with booking and client management',
    permissions: [
      PermissionType.APPOINTMENT_CREATE,
      PermissionType.APPOINTMENT_READ,
      PermissionType.APPOINTMENT_UPDATE,
      PermissionType.APPOINTMENT_DELETE,
      PermissionType.USER_READ,
      PermissionType.SERVICE_READ,
      PermissionType.PRODUCT_READ,
      PermissionType.DASHBOARD_VIEW,
      PermissionType.NOTIFICATIONS_MANAGE
    ]
  },

  customer: {
    name: 'Customer',
    description: 'Registered customers with booking access',
    permissions: [
      PermissionType.APPOINTMENT_CREATE,
      PermissionType.APPOINTMENT_READ,
      PermissionType.APPOINTMENT_UPDATE, // Limited to own appointments
      PermissionType.PRODUCT_READ
    ]
  },

  guest: {
    name: 'Guest',
    description: 'Anonymous users for booking',
    permissions: [
      PermissionType.APPOINTMENT_CREATE,
      PermissionType.SERVICE_READ,
      PermissionType.PRODUCT_READ
    ]
  }
} as const;

// ========================================
// ADVANCED AVAILABILITY MANAGEMENT
// ========================================

// Employee schedules - flexible work hours
export const employeeSchedules = sqliteTable('employee_schedules', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull().references(() => employees.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 6 = Saturday
  startTime: text('start_time').notNull(), // HH:MM format
  endTime: text('end_time').notNull(), // HH:MM format
  breakStart: text('break_start'), // Optional break period
  breakEnd: text('break_end'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  employeeIdx: index('employee_schedules_employee_idx').on(table.employeeId),
  dayIdx: index('employee_schedules_day_idx').on(table.dayOfWeek),
}));

// Holiday and closure management
export const holidays = sqliteTable('holidays', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  date: text('date').notNull(), // YYYY-MM-DD format
  isRecurring: integer('is_recurring', { mode: 'boolean' }).default(false),
  affectsAllEmployees: integer('affects_all_employees', { mode: 'boolean' }).default(true),
  affectedEmployeeIds: text('affected_employee_ids', { mode: 'json' }).$type<string[]>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('holidays_tenant_idx').on(table.tenantId),
  dateIdx: index('holidays_date_idx').on(table.date),
}));

// Blocked time slots for maintenance/cleaning
export const blockedSlots = sqliteTable('blocked_slots', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  employeeId: text('employee_id').references(() => employees.id, { onDelete: 'cascade' }), // Null = all employees
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }).notNull(),
  reason: text('reason').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdBy: text('created_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  tenantIdx: index('blocked_slots_tenant_idx').on(table.tenantId),
  employeeIdx: index('blocked_slots_employee_idx').on(table.employeeId),
  timeIdx: index('blocked_slots_time_idx').on(table.startTime, table.endTime),
}));

// ========================================
// PAYMENT PLANS & DEPOSITS
// ========================================

// Enhanced payment plans for deposits and installments
export const paymentPlans = sqliteTable('payment_plans', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').notNull().references(() => appointments.id, { onDelete: 'cascade' }),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  totalAmount: integer('total_amount').notNull(), // Total booking amount in cents
  depositAmount: integer('deposit_amount'), // Required deposit in cents (null = full payment)
  depositPercentage: integer('deposit_percentage'), // Alternative to fixed amount
  paymentSchedule: text('payment_schedule', { mode: 'json' }).$type<{
    dueDate: string;
    amount: number;
    description: string;
    isPaid: boolean;
    paymentId?: string;
  }[]>(),
  status: text('status').default('pending'), // 'pending', 'deposit_paid', 'completed', 'cancelled'
  autoChargeEnabled: integer('auto_charge_enabled', { mode: 'boolean' }).default(false),
  reminderSettings: text('reminder_settings', { mode: 'json' }).$type<{
    emailReminders: boolean;
    smsReminders: boolean;
    daysBeforeDue: number[];
  }>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  bookingIdx: index('payment_plans_booking_idx').on(table.bookingId),
  tenantIdx: index('payment_plans_tenant_idx').on(table.tenantId),
  statusIdx: index('payment_plans_status_idx').on(table.status),
}));

// Payment tracking for multi-part payments
export const paymentInstallments = sqliteTable('payment_installments', {
  id: text('id').primaryKey(),
  paymentPlanId: text('payment_plan_id').notNull().references(() => paymentPlans.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(), // Amount in cents
  dueDate: integer('due_date', { mode: 'timestamp' }).notNull(),
  paidDate: integer('paid_date', { mode: 'timestamp' }),
  status: text('status').default('pending'), // 'pending', 'paid', 'overdue', 'cancelled'
  paymentMethod: text('payment_method'),
  transactionId: text('transaction_id'),
  failureReason: text('failure_reason'),
  reminderSent: integer('reminder_sent', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  planIdx: index('payment_installments_plan_idx').on(table.paymentPlanId),
  dueDateIdx: index('payment_installments_due_idx').on(table.dueDate),
  statusIdx: index('payment_installments_status_idx').on(table.status),
}));
