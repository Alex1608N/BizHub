CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`actiune` text NOT NULL,
	`tabel` text NOT NULL,
	`date_vechi` text,
	`date_noi` text,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `utilizatori`(`id`) ON UPDATE no action ON DELETE no action
);
