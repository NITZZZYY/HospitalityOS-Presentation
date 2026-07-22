import { pgTable, uuid, timestamp, varchar, text, integer, boolean, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Base columns mixin for all tables
export const baseColumns = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  version: integer('version').notNull().default(1),
};

// Multi-tenancy columns
export const tenantColumns = {
  organizationId: uuid('organization_id').notNull(),
  propertyId: uuid('property_id'),
};

// Audit columns
export const auditColumns = {
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
  deletedBy: uuid('deleted_by'),
};

// Common indexes
export const tenantIndex = (tableName: string) => 
  index(`${tableName}_org_idx`).on(sql`organization_id`);

export const propertyIndex = (tableName: string) => 
  index(`${tableName}_property_idx`).on(sql`property_id`);

export const deletedAtIndex = (tableName: string) => 
  index(`${tableName}_deleted_idx`).on(sql`deleted_at`);
