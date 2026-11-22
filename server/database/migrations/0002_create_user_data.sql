CREATE TABLE IF NOT EXISTS `user_data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`bot_url` text,
	`bot_token` text,
	`cf_token` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `user_data_user_id_unique` ON `user_data` (`user_id`);
--> statement-breakpoint
-- Migrate existing bot data from users to user_data
INSERT OR IGNORE INTO user_data (user_id, bot_url, bot_token, cf_token, created_at, updated_at)
SELECT id, bot_url, bot_token, cf_token, created_at, updated_at FROM users
WHERE bot_url IS NOT NULL OR bot_token IS NOT NULL OR cf_token IS NOT NULL;
--> statement-breakpoint
-- Drop bot columns from users table (D1/SQLite 3.42+ supports DROP COLUMN)
ALTER TABLE `users` DROP COLUMN `bot_url`;
--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `bot_token`;
--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `cf_token`;