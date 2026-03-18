CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`path` text NOT NULL,
	`thumbnail_path` text,
	`alt` text,
	`title` text,
	`width` integer,
	`height` integer,
	`uploaded_by` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `media_filename_idx` ON `media` (`filename`);--> statement-breakpoint
CREATE INDEX `media_uploaded_by_idx` ON `media` (`uploaded_by`);