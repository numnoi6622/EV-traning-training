ALTER TABLE `registrations` MODIFY COLUMN `paymentStatus` enum('unpaid','pending','completed','failed') NOT NULL DEFAULT 'unpaid';--> statement-breakpoint
ALTER TABLE `registrations` ADD `paymentSlipUrl` mediumtext;--> statement-breakpoint
ALTER TABLE `registrations` ADD `billingAddress` text;