import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const rooms = sqliteTable('rooms', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  adminToken: text('admin_token').notNull(),
  status: text('status').notNull().default('waiting'),
  createdAt: integer('created_at').notNull(),
});

export const participants = sqliteTable('participants', {
  id: text('id').primaryKey(),
  roomCode: text('room_code').notNull().references(() => rooms.code, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  joinedAt: integer('joined_at').notNull(),
}, (table) => [uniqueIndex('idx_participants_room_name').on(table.roomCode, table.name)]);
