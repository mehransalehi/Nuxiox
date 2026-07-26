CREATE TABLE `blog_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_categories_locales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category_id` int NOT NULL,
	`locale` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`description` text,
	CONSTRAINT `blog_categories_locales_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_categories_locale_unique` UNIQUE(`category_id`,`locale`),
	CONSTRAINT `blog_categories_slug_locale_unique` UNIQUE(`slug`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `blog_comment_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`comment_id` int NOT NULL,
	`user_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `blog_comment_likes_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_comment_likes_unique_idx` UNIQUE(`comment_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `blog_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_id` int,
	`parent_id` int,
	`author_name` varchar(191),
	`author_email` varchar(191),
	`content` text NOT NULL,
	`seo` json NOT NULL DEFAULT '{}',
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`like_count` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_post_categories` (
	`post_id` int NOT NULL,
	`category_id` int NOT NULL,
	CONSTRAINT `blog_post_categories_post_id_category_id_pk` PRIMARY KEY(`post_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author_id` int,
	`featured_image` varchar(191),
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`allow_comments` boolean NOT NULL DEFAULT true,
	`allow_anonymous_comments` boolean NOT NULL DEFAULT true,
	`published_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts_locales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`locale` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`seo` json NOT NULL DEFAULT '{}',
	CONSTRAINT `blog_posts_locales_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_locale_unique` UNIQUE(`post_id`,`locale`),
	CONSTRAINT `blog_posts_slug_locale_unique` UNIQUE(`slug`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `colleagues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`icon` text,
	`image` text,
	`link` text,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `colleagues_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `colleagues_locales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`colleague_id` int NOT NULL,
	`locale` varchar(191) NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`description` text,
	`extra` json NOT NULL DEFAULT '[]',
	CONSTRAINT `colleagues_locales_id` PRIMARY KEY(`id`),
	CONSTRAINT `colleagues_locale_unique` UNIQUE(`colleague_id`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`subject` varchar(191),
	`message` text NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(191) NOT NULL,
	`original_name` varchar(191) NOT NULL,
	`mime_type` varchar(191) NOT NULL,
	`size` int NOT NULL,
	`path` varchar(191) NOT NULL,
	`thumbnail_path` varchar(191),
	`alt` varchar(191),
	`title` varchar(191),
	`width` int,
	`height` int,
	`uploaded_by` int,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`status` varchar(191) NOT NULL DEFAULT 'draft',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages_locales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page_id` int NOT NULL,
	`locale` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`seo` json NOT NULL,
	`builder` json NOT NULL,
	CONSTRAINT `pages_locales_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_locale_unique` UNIQUE(`page_id`,`locale`),
	CONSTRAINT `pages_slug_locale_unique` UNIQUE(`slug`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`icon` varchar(191),
	`image` varchar(191),
	`link` varchar(191),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services_locales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`service_id` int NOT NULL,
	`locale` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`subtitle` varchar(191),
	`description` text,
	`extra` json NOT NULL DEFAULT '[]',
	CONSTRAINT `services_locales_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_locale_unique` UNIQUE(`service_id`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` varchar(191) NOT NULL,
	`value` json NOT NULL,
	`description` text,
	`is_public` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`avatar` varchar(191),
	`rating` int NOT NULL DEFAULT 5,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials_locales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testimonial_id` int NOT NULL,
	`locale` varchar(191) NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`content` text NOT NULL,
	CONSTRAINT `testimonials_locales_id` PRIMARY KEY(`id`),
	CONSTRAINT `testimonials_locale_unique` UNIQUE(`testimonial_id`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`token` text,
	`role` text NOT NULL DEFAULT ('user'),
	`created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `blog_categories_locales` ADD CONSTRAINT `blog_categories_locales_category_id_blog_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_comment_likes` ADD CONSTRAINT `blog_comment_likes_comment_id_blog_comments_id_fk` FOREIGN KEY (`comment_id`) REFERENCES `blog_comments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_comment_likes` ADD CONSTRAINT `blog_comment_likes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_comments` ADD CONSTRAINT `blog_comments_post_id_blog_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_comments` ADD CONSTRAINT `blog_comments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_categories` ADD CONSTRAINT `blog_post_categories_post_id_blog_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_categories` ADD CONSTRAINT `blog_post_categories_category_id_blog_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_posts_locales` ADD CONSTRAINT `blog_posts_locales_post_id_blog_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `colleagues_locales` ADD CONSTRAINT `colleagues_locales_colleague_id_colleagues_id_fk` FOREIGN KEY (`colleague_id`) REFERENCES `colleagues`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media` ADD CONSTRAINT `media_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pages_locales` ADD CONSTRAINT `pages_locales_page_id_pages_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services_locales` ADD CONSTRAINT `services_locales_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `testimonials_locales` ADD CONSTRAINT `testimonials_locales_testimonial_id_testimonials_id_fk` FOREIGN KEY (`testimonial_id`) REFERENCES `testimonials`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `blog_comments_post_status_idx` ON `blog_comments` (`post_id`,`status`);--> statement-breakpoint
CREATE INDEX `blog_comments_parent_idx` ON `blog_comments` (`parent_id`);--> statement-breakpoint
CREATE INDEX `blog_post_categories_category_idx` ON `blog_post_categories` (`category_id`);--> statement-breakpoint
CREATE INDEX `blog_posts_status_published_idx` ON `blog_posts` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `blog_posts_author_idx` ON `blog_posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `media_filename_idx` ON `media` (`filename`);--> statement-breakpoint
CREATE INDEX `media_uploaded_by_idx` ON `media` (`uploaded_by`);--> statement-breakpoint
CREATE INDEX `settings_is_public_idx` ON `settings` (`is_public`);