import { pgTable, uuid, varchar, text, boolean, integer, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { baseColumns, tenantColumns, auditColumns } from './common';

// Organization table - Top level tenant
export const organizations = pgTable('organizations', {
  ...baseColumns,
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  legalName: varchar('legal_name', { length: 255 }),
  taxId: varchar('tax_id', { length: 50 }),
  registrationNumber: varchar('registration_number', { length: 100 }),
  type: varchar('type', { length: 50 }).notNull().default('enterprise'), // enterprise, sma, chain
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, inactive, suspended
  settings: jsonb('settings').default({}),
  subscriptionPlan: varchar('subscription_plan', { length: 50 }),
  subscriptionExpiry: timestamp('subscription_expiry', { withTimezone: true }),
  maxProperties: integer('max_properties'),
  maxUsers: integer('max_users'),
  features: jsonb('features').default([]),
  ...auditColumns,
}, (table) => ({
  orgCodeIdx: uniqueIndex('organizations_code_idx').on(table.code),
  orgStatusIdx: index('organizations_status_idx').on(table.status),
}));

// Hotel Chain table
export const hotelChains = pgTable('hotel_chains', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  description: text('description'),
  brandLogo: varchar('brand_logo', { length: 500 }),
  brandColors: jsonb('brand_colors').default({}),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  settings: jsonb('settings').default({}),
  ...auditColumns,
}, (table) => ({
  chainOrgIdx: index('hotel_chains_org_idx').on(table.organizationId),
  chainCodeIdx: uniqueIndex('hotel_chains_code_org_idx').on(table.code, table.organizationId),
}));

// Property/Hotel table
export const properties = pgTable('properties', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  hotelChainId: uuid('hotel_chain_id').references(() => hotelChains.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  propertyType: varchar('property_type', { length: 50 }).notNull().default('hotel'), // hotel, resort, hostel, apartment
  starRating: integer('star_rating'),
  address: text('address'),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }),
  latitude: varchar('latitude', { length: 20 }),
  longitude: varchar('longitude', { length: 20 }),
  timezone: varchar('timezone', { length: 50 }).notNull().default('UTC'),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  language: varchar('language', { length: 10 }).notNull().default('en'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 500 }),
  checkInTime: varchar('check_in_time', { length: 10 }).default('14:00'),
  checkOutTime: varchar('check_out_time', { length: 10 }).default('11:00'),
  logo: varchar('logo', { length: 500 }),
  images: jsonb('images').default([]),
  amenities: jsonb('amenities').default([]),
  settings: jsonb('settings').default({}),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  ...auditColumns,
}, (table) => ({
  propertyOrgIdx: index('properties_org_idx').on(table.organizationId),
  propertyCodeIdx: uniqueIndex('properties_code_org_idx').on(table.code, table.organizationId),
  propertyChainIdx: index('properties_chain_idx').on(table.hotelChainId),
  propertyStatusIdx: index('properties_status_idx').on(table.status),
}));

// Branch table (for multi-location properties)
export const branches = pgTable('branches', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  settings: jsonb('settings').default({}),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  ...auditColumns,
}, (table) => ({
  branchOrgIdx: index('branches_org_idx').on(table.organizationId),
  branchPropertyIdx: index('branches_property_idx').on(table.propertyId),
  branchCodeIdx: uniqueIndex('branches_code_property_idx').on(table.code, table.propertyId),
}));

// Department table
export const departments = pgTable('departments', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  description: text('description'),
  parentDepartmentId: uuid('parent_department_id').references((): any => departments.id, { onDelete: 'set null' }),
  managerId: uuid('manager_id'),
  color: varchar('color', { length: 20 }),
  displayOrder: integer('display_order').default(0),
  isActive: boolean('is_active').notNull().default(true),
  settings: jsonb('settings').default({}),
  ...auditColumns,
}, (table) => ({
  deptOrgIdx: index('departments_org_idx').on(table.organizationId),
  deptPropertyIdx: index('departments_property_idx').on(table.propertyId),
  deptCodeIdx: uniqueIndex('departments_code_org_property_idx').on(table.code, table.organizationId, table.propertyId),
}));

// Business Unit table
export const businessUnits = pgTable('business_units', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // restaurant, spa, gym, pool, etc.
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  revenueCenter: boolean('revenue_center').notNull().default(false),
  costCenter: boolean('cost_center').notNull().default(false),
  settings: jsonb('settings').default({}),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  ...auditColumns,
}, (table) => ({
  buOrgIdx: index('business_units_org_idx').on(table.organizationId),
  buPropertyIdx: index('business_units_property_idx').on(table.propertyId),
  buCodeIdx: uniqueIndex('business_units_code_org_property_idx').on(table.code, table.organizationId, table.propertyId),
}));

// Tax Settings table
export const taxSettings = pgTable('tax_settings', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  taxType: varchar('tax_type', { length: 50 }).notNull(), // gst, vat, service_tax, tourism_tax, etc.
  rate: varchar('rate', { length: 10 }).notNull(), // decimal as string for precision
  isCompound: boolean('is_compound').notNull().default(false),
  isServiceTax: boolean('is_service_tax').notNull().default(false),
  applyOn: varchar('apply_on', { length: 50 }).notNull().default('room_rate'), // room_rate, food, beverage, all
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  settings: jsonb('settings').default({}),
  ...auditColumns,
}, (table) => ({
  taxOrgIdx: index('tax_settings_org_idx').on(table.organizationId),
  taxPropertyIdx: index('tax_settings_property_idx').on(table.propertyId),
  taxCodeIdx: uniqueIndex('tax_settings_code_org_property_idx').on(table.code, table.organizationId, table.propertyId),
}));

// Currency table
export const currencies = pgTable('currencies', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 3 }).notNull(), // ISO 4217 code
  name: varchar('name', { length: 100 }).notNull(),
  symbol: varchar('symbol', { length: 10 }),
  decimalPlaces: integer('decimal_places').notNull().default(2),
  exchangeRate: varchar('exchange_rate', { length: 20 }).notNull().default('1.000000'),
  isBaseCurrency: boolean('is_base_currency').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  ...auditColumns,
}, (table) => ({
  currencyOrgIdx: index('currencies_org_idx').on(table.organizationId),
  currencyCodeIdx: uniqueIndex('currencies_code_org_idx').on(table.code, table.organizationId),
  currencyBaseIdx: uniqueIndex('currencies_base_org_idx').on(table.organizationId).where(sql`is_base_currency = true`),
}));

// Language table
export const languages = pgTable('languages', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 10 }).notNull(), // ISO 639-1 or 639-3
  name: varchar('name', { length: 100 }).notNull(),
  nativeName: varchar('native_name', { length: 100 }),
  direction: varchar('direction', { length: 4 }).notNull().default('ltr'), // ltr, rtl
  isActive: boolean('is_active').notNull().default(true),
  isDefault: boolean('is_default').notNull().default(false),
  ...auditColumns,
}, (table) => ({
  langOrgIdx: index('languages_org_idx').on(table.organizationId),
  langCodeIdx: uniqueIndex('languages_code_org_idx').on(table.code, table.organizationId),
  langDefaultIdx: uniqueIndex('languages_default_org_idx').on(table.organizationId).where(sql`is_default = true`),
}));

// Brand Settings table
export const brandSettings = pgTable('brand_settings', {
  ...baseColumns,
  ...tenantColumns,
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }),
  key: varchar('key', { length: 255 }).notNull(),
  value: text('value').notNull(),
  type: varchar('type', { length: 50 }).notNull().default('string'), // string, json, boolean, number
  description: text('description'),
  isPublic: boolean('is_public').notNull().default(false),
  ...auditColumns,
}, (table) => ({
  brandOrgIdx: index('brand_settings_org_idx').on(table.organizationId),
  brandPropertyIdx: index('brand_settings_property_idx').on(table.propertyId),
  brandKeyIdx: uniqueIndex('brand_settings_key_org_property_idx').on(table.key, table.organizationId, table.propertyId),
}));
