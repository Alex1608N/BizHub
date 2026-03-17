CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tabel_afectat` text NOT NULL,
	`coloana` text,
	`valoare_veche` text,
	`valoare_noua` text,
	`utilizator_id` integer,
	`data_creare` integer DEFAULT '"2026-03-17T20:59:51.639Z"' NOT NULL,
	`motiv` text,
	FOREIGN KEY (`utilizator_id`) REFERENCES `utilizatori`(`id`) ON UPDATE no action ON DELETE no action
);
