import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const rooms = sqliteTable('rooms', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  adminToken: text('admin_token').notNull(),
  status: text('status').notNull().default('waiting'),
  durationMinutes: integer('duration_minutes').notNull().default(10),
  endsAt: integer('ends_at'),
  createdAt: integer('created_at').notNull(),
});

export const participants = sqliteTable('participants', {
  id: text('id').primaryKey(),
  roomCode: text('room_code').notNull().references(() => rooms.code, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  joinedAt: integer('joined_at').notNull(),
}, (table) => [uniqueIndex('idx_participants_room_name').on(table.roomCode, table.name)]);

export const sentCards = sqliteTable('sent_cards', {
  id: text('id').primaryKey(),
  roomCode: text('room_code').notNull().references(() => rooms.code, { onDelete: 'cascade' }),
  cardId: integer('card_id').notNull(),
  recipientName: text('recipient_name').notNull(),
  senderName: text('sender_name').notNull(),
  anonymous: integer('anonymous', { mode: 'boolean' }).notNull().default(false),
  sentAt: integer('sent_at').notNull(),
});
