CREATE TABLE `blog_categories_locales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_categories_locale_unique` ON `blog_categories_locales` (`category_id`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `blog_categories_slug_locale_unique` ON `blog_categories_locales` (`slug`,`locale`);--> statement-breakpoint
CREATE TABLE `blog_posts_locales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`seo` text DEFAULT '{}' NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_locale_unique` ON `blog_posts_locales` (`post_id`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_locale_unique` ON `blog_posts_locales` (`slug`,`locale`);--> statement-breakpoint
CREATE TABLE `colleagues_locales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`colleague_id` integer NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`description` text,
	`extra` text DEFAULT '[]' NOT NULL,
	FOREIGN KEY (`colleague_id`) REFERENCES `colleagues`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `colleagues_locale_unique` ON `colleagues_locales` (`colleague_id`,`locale`);--> statement-breakpoint
CREATE TABLE `pages_locales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`locale` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`seo` text NOT NULL,
	`builder` text NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_locale_unique` ON `pages_locales` (`page_id`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_locale_unique` ON `pages_locales` (`slug`,`locale`);--> statement-breakpoint
CREATE TABLE `services_locales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_id` integer NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`description` text,
	`extra` text DEFAULT '[]' NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_locale_unique` ON `services_locales` (`service_id`,`locale`);--> statement-breakpoint
CREATE TABLE `testimonials_locales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`testimonial_id` integer NOT NULL,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`content` text NOT NULL,
	FOREIGN KEY (`testimonial_id`) REFERENCES `testimonials`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `testimonials_locale_unique` ON `testimonials_locales` (`testimonial_id`,`locale`);--> statement-breakpoint
DROP INDEX `blog_categories_name_unique`;--> statement-breakpoint
DROP INDEX `blog_categories_slug_unique`;--> statement-breakpoint
DROP INDEX `blog_categories_slug_idx`;--> statement-breakpoint
ALTER TABLE `blog_categories` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `blog_categories` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `blog_categories` DROP COLUMN `description`;--> statement-breakpoint
DROP INDEX `blog_posts_slug_unique`;--> statement-breakpoint
DROP INDEX `blog_posts_slug_idx`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `excerpt`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `content`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP COLUMN `seo`;--> statement-breakpoint
DROP INDEX `pages_slug_unique`;--> statement-breakpoint
ALTER TABLE `pages` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `pages` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `pages` DROP COLUMN `seo`;--> statement-breakpoint
ALTER TABLE `pages` DROP COLUMN `builder`;--> statement-breakpoint
ALTER TABLE `colleagues` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `colleagues` DROP COLUMN `subtitle`;--> statement-breakpoint
ALTER TABLE `colleagues` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `colleagues` DROP COLUMN `extra`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `subtitle`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `extra`;--> statement-breakpoint
ALTER TABLE `testimonials` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `testimonials` DROP COLUMN `role`;--> statement-breakpoint
ALTER TABLE `testimonials` DROP COLUMN `content`;