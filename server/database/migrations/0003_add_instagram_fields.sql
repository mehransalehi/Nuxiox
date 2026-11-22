ALTER TABLE `user_data` ADD COLUMN `instagram_account_id` text;
--> statement-breakpoint
ALTER TABLE `user_data` ADD COLUMN `instagram_user_id` text;
--> statement-breakpoint
ALTER TABLE `user_data` ADD COLUMN `instagram_page_id` text;
--> statement-breakpoint
ALTER TABLE `user_data` ADD COLUMN `instagram_access_token` text;
--> statement-breakpoint
ALTER TABLE `user_data` ADD COLUMN `instagram_is_active` integer DEFAULT 1 NOT NULL;