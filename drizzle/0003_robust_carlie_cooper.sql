ALTER TABLE `blog_posts` ADD `language` varchar(10) DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `parentId` int;