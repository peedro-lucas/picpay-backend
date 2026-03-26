import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const idempotencyKeys = pgTable('idempotency_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),
  status: text('status').notNull(), // PENDING | SUCCESS | FAILED
  requestHash: text('request_hash').notNull(),
  response: jsonb('response'),
  createdAt: timestamp('created_at').defaultNow(),
});