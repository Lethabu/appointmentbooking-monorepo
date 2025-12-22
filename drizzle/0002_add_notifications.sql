CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL REFERENCES `tenants`(`id`),
	`user_id` text NOT NULL REFERENCES `users`(`id`),
	`appointment_id` text REFERENCES `appointments`(`id`),
	`type` text NOT NULL,
	`channel` text NOT NULL,
	`recipient` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'pending',
	`sent_at` integer,
	`created_at` integer DEFAULT (unixepoch())
);

CREATE INDEX `notifications_tenant_idx` ON `notifications` (`tenant_id`);
CREATE INDEX `notifications_user_idx` ON `notifications` (`user_id`);
CREATE INDEX `notifications_appointment_idx` ON `notifications` (`appointment_id`);
CREATE INDEX `notifications_status_idx` ON `notifications` (`status`);
