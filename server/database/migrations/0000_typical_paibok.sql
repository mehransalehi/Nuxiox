CREATE TABLE `blog_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE `blog_comment_likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comment_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`comment_id`) REFERENCES `blog_comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_comment_likes_unique_idx` ON `blog_comment_likes` (`comment_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `blog_comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`user_id` integer,
	`parent_id` integer,
	`author_name` text,
	`author_email` text,
	`content` text NOT NULL,
	`seo` text DEFAULT '{}' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`like_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `blog_comments_post_status_idx` ON `blog_comments` (`post_id`,`status`);--> statement-breakpoint
CREATE INDEX `blog_comments_parent_idx` ON `blog_comments` (`parent_id`);--> statement-breakpoint
CREATE TABLE `blog_post_categories` (
	`post_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_post_categories_pk` ON `blog_post_categories` (`post_id`,`category_id`);--> statement-breakpoint
CREATE INDEX `blog_post_categories_category_idx` ON `blog_post_categories` (`category_id`);--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` integer,
	`featured_image` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`allow_comments` integer DEFAULT true NOT NULL,
	`allow_anonymous_comments` integer DEFAULT true NOT NULL,
	`published_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `blog_posts_status_published_idx` ON `blog_posts` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `blog_posts_author_idx` ON `blog_posts` (`author_id`);--> statement-breakpoint
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
CREATE TABLE `colleagues` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`icon` text,
	`image` text,
	`link` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE `contact_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text,
	`message` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
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
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `media_filename_idx` ON `media` (`filename`);--> statement-breakpoint
CREATE INDEX `media_uploaded_by_idx` ON `media` (`uploaded_by`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`icon` text,
	`image` text,
	`link` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`is_public` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `settings_is_public_idx` ON `settings` (`is_public`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`avatar` text,
	`rating` integer DEFAULT 5 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`token` text,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);