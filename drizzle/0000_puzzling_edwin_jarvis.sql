CREATE TABLE `categorii` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nume` text NOT NULL,
	`descriere` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categorii_nume_unique` ON `categorii` (`nume`);--> statement-breakpoint
CREATE TABLE `companii` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nume` text NOT NULL,
	`cui` text,
	`adresa` text,
	`logo_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companii_cui_unique` ON `companii` (`cui`);--> statement-breakpoint
CREATE TABLE `sesiuni` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`data_expirare` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `utilizatori`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `unitati` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nume` text NOT NULL,
	`simbol` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unitati_nume_unique` ON `unitati` (`nume`);--> statement-breakpoint
CREATE UNIQUE INDEX `unitati_simbol_unique` ON `unitati` (`simbol`);--> statement-breakpoint
CREATE TABLE `utilizatori` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nume` text NOT NULL,
	`email` text NOT NULL,
	`parola_hash` text NOT NULL,
	`rol` text DEFAULT 'ANGAJAT' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `utilizatori_email_unique` ON `utilizatori` (`email`);