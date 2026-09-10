ALTER TABLE `participants` ADD `name_key` text;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_participants_room_name_key` ON `participants` (`room_code`,`name_key`);--> statement-breakpoint
PRAGMA optimize;
