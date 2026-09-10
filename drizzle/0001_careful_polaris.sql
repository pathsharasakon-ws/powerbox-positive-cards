CREATE TABLE `sent_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`room_code` text NOT NULL,
	`card_id` integer NOT NULL,
	`recipient_name` text NOT NULL,
	`sender_name` text NOT NULL,
	`anonymous` integer DEFAULT false NOT NULL,
	`sent_at` integer NOT NULL,
	FOREIGN KEY (`room_code`) REFERENCES `rooms`(`code`) ON UPDATE no action ON DELETE cascade
);
