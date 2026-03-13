CREATE TABLE `produse` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nume` text NOT NULL,
	`descriere` text,
	`pret` integer DEFAULT 0 NOT NULL,
	`stoc` integer DEFAULT 0 NOT NULL,
	`categorie_id` integer,
	`unitate_id` integer,
	FOREIGN KEY (`categorie_id`) REFERENCES `categorii`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unitate_id`) REFERENCES `unitati`(`id`) ON UPDATE no action ON DELETE no action
);
