import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { baseColumns, tenantColumns, auditColumns } from './common';
import { organizations, properties } from './organization';

// Users table
export const users = pgTable('users', {
  ...baseColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  avatar: varchar('avatar', { length: 500 }),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  language: varchar('language', { length: 10 }).default('en'),
  dateFormat: varchar('date_format', { length: 20 }).default('DD/MM/YYYY'),
  timeFormat: varchar('time_format', { length: 20 }).default('24h'),
  currency: varchar('currency', { length: 3 }).default('USD'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, active, suspended, terminated
  isEmailVerified: boolean('is_email_verified').notNull().default(false),
  isPhoneVerified: boolean('is_phone_verified').notNull().default(false),
  mfaEnabled: boolean('mfa_enabled').notNull().default(false),
  mfaSecret: varchar('mfa_secret', { length: 255 }),
  mfaBackupCodes: jsonb('mfa_backup_codes').default([]),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  lastLoginIp: varchar('last_login_ip', { length: 50 }),
  lastPasswordChange: timestamp('last_password_change', { withTimezone: true }),
  failedLoginAttempts: integer('failed_login_attempts').notNull().default(0),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  mustChangePassword: boolean('must_change_password').notNull().default(false),
  preferences: jsonb('preferences').default({}),
  metadata: jsonb('metadata').default({}),
  ...auditColumns,
}, (table) => ({
  userOrgIdx: index('users_org_idx').on(table.organizationId),
  userEmailIdx: uniqueIndex('users_email_org_idx').on(table.email, table.organizationId),
  userPropertyIdx: index('users_property_idx').on(table.propertyId),
  userStatusIdx: index('users_status_idx').on(table.status),
}));

// Roles table
export const roles = pgTable('roles', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull().default('custom'), // system, custom
  isSystem: boolean('is_system').notNull().default(false),
  isDefault: boolean('is_default').notNull().default(false),
  permissions: jsonb('permissions').default([]),
  settings: jsonb('settings').default({}),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  ...auditColumns,
}, (table) => ({
  roleOrgIdx: index('roles_org_idx').on(table.organizationId),
  roleCodeIdx: uniqueIndex('roles_code_org_property_idx').on(table.code, table.organizationId, table.propertyId),
  roleNameIdx: index('roles_name_org_property_idx').on(table.name, table.organizationId, table.propertyId),
}));

// User Roles mapping table
export const userRoles = pgTable('user_roles', {
  ...baseColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  roleId: uuid('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  assignedBy: uuid('assigned_by').references(() => users.id, { onDelete: 'set null' }),
  assignedAt: timestamp('assigned_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
  ...auditColumns,
}, (table) => ({
  userRoleUserIdx: index('user_roles_user_idx').on(table.userId),
  userRoleRoleIdx: index('user_roles_role_idx').on(table.roleId),
  userRoleUniqueIdx: uniqueIndex('user_roles_user_role_idx').on(table.userId, table.roleId).where(sql`is_active = true`),
}));

// Permissions table
export const permissions = pgTable('permissions', {
  ...baseColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(), // auth, user, property, reservation, etc.
  action: varchar('action', { length: 50 }).notNull(), // create, read, update, delete, approve, etc.
  resource: varchar('resource', { length: 100 }).notNull(), // users, properties, reservations, etc.
  scope: varchar('scope', { length: 50 }).notNull().default('own'), // own, department, property, organization
  isSystem: boolean('is_system').notNull().default(true),
  ...auditColumns,
}, (table) => ({
  permissionOrgIdx: index('permissions_org_idx').on(table.organizationId),
  permissionCodeIdx: uniqueIndex('permissions_code_org_idx').on(table.code, table.organizationId),
  permissionCategoryIdx: index('permissions_category_idx').on(table.category),
}));

// Sessions table
export const sessions = pgTable('sessions', {
  ...baseColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull(),
  deviceInfo: jsonb('device_info').default({}),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  location: jsonb('location').default({}),
  isActive: boolean('is_active').notNull().default(true),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).notNull().defaultNow(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  revokedReason: varchar('revoked_reason', { length: 255 }),
  ...auditColumns,
}, (table) => ({
  sessionUserIdx: index('sessions_user_idx').on(table.userId),
  sessionActiveIdx: index('sessions_active_idx').on(table.isActive).where(sql`is_active = true`),
  sessionExpiryIdx: index('sessions_expiry_idx').on(table.expiresAt),
}));

// Password reset tokens table
export const passwordResetTokens = pgTable('password_reset_tokens', {
  ...baseColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  isValid: boolean('is_valid').notNull().default(true),
}, (table) => ({
  passwordResetTokenIdx: uniqueIndex('password_reset_tokens_token_idx').on(table.token),
  passwordResetUserIdx: index('password_reset_tokens_user_idx').on(table.userId),
  passwordResetExpiryIdx: index('password_reset_tokens_expiry_idx').on(table.expiresAt),
}));

// Email verification tokens table
export const emailVerificationTokens = pgTable('email_verification_tokens', {
  ...baseColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  isValid: boolean('is_valid').notNull().default(true),
}, (table) => ({
  emailVerificationTokenIdx: uniqueIndex('email_verification_tokens_token_idx').on(table.token),
  emailVerificationUserIdx: index('email_verification_tokens_user_idx').on(table.userId),
}));

// Audit logs table
export const auditLogs = pgTable('audit_logs', {
  ...baseColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  oldValue: jsonb('old_value').default({}),
  newValue: jsonb('new_value').default({}),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  sessionId: uuid('session_id'),
  requestId: varchar('request_id', { length: 100 }),
  metadata: jsonb('metadata').default({}),
}, (table) => ({
  auditLogOrgIdx: index('audit_logs_org_idx').on(table.organizationId),
  auditLogPropertyIdx: index('audit_logs_property_idx').on(table.propertyId),
  auditLogUserIdx: index('audit_logs_user_idx').on(table.userId),
  auditLogEntityIdx: index('audit_logs_entity_idx').on(table.entityType, table.entityId),
  auditLogActionIdx: index('audit_logs_action_idx').on(table.action),
  auditLogCreatedAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}));

// Device management table
export const devices = pgTable('devices', {
  ...baseColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  deviceId: varchar('device_id', { length: 255 }).notNull(),
  deviceName: varchar('device_name', { length: 255 }),
  deviceType: varchar('device_type', { length: 50 }), // mobile, tablet, desktop
  platform: varchar('platform', { length: 50 }), // ios, android, windows, macos, linux
  osVersion: varchar('os_version', { length: 50 }),
  appVersion: varchar('app_version', { length: 50 }),
  pushToken: varchar('push_token', { length: 500 }),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }).notNull().defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
  isTrusted: boolean('is_trusted').notNull().default(false),
  metadata: jsonb('metadata').default({}),
  ...auditColumns,
}, (table) => ({
  deviceUserIdx: index('devices_user_idx').on(table.userId),
  deviceIdIdx: uniqueIndex('devices_device_id_user_idx').on(table.deviceId, table.userId),
  deviceActiveIdx: index('devices_active_idx').on(table.isActive).where(sql`is_active = true`),
}));
