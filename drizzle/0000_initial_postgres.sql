CREATE TYPE "public"."rol" AS ENUM('ADMIN', 'MANAGER', 'ANGAJAT', 'CONTABIL');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"actiune" text NOT NULL,
	"tabel" text NOT NULL,
	"date_vechi" text,
	"date_noi" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categorii" (
	"id" serial PRIMARY KEY NOT NULL,
	"nume" text NOT NULL,
	"descriere" text,
	CONSTRAINT "categorii_nume_unique" UNIQUE("nume")
);
--> statement-breakpoint
CREATE TABLE "companii" (
	"id" serial PRIMARY KEY NOT NULL,
	"nume" text NOT NULL,
	"cui" text,
	"reg_com" text,
	"adresa" text,
	"iban" text,
	"banca" text,
	"logo_url" text,
	"telefon" text,
	"email" text,
	CONSTRAINT "companii_cui_unique" UNIQUE("cui")
);
--> statement-breakpoint
CREATE TABLE "produse" (
	"id" serial PRIMARY KEY NOT NULL,
	"nume" text NOT NULL,
	"descriere" text,
	"pret" integer DEFAULT 0 NOT NULL,
	"stoc" integer DEFAULT 0 NOT NULL,
	"categorie_id" integer,
	"unitate_id" integer
);
--> statement-breakpoint
CREATE TABLE "sesiuni" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"data_expirare" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unitati" (
	"id" serial PRIMARY KEY NOT NULL,
	"nume" text NOT NULL,
	"simbol" text NOT NULL,
	CONSTRAINT "unitati_nume_unique" UNIQUE("nume"),
	CONSTRAINT "unitati_simbol_unique" UNIQUE("simbol")
);
--> statement-breakpoint
CREATE TABLE "utilizatori" (
	"id" serial PRIMARY KEY NOT NULL,
	"nume" text NOT NULL,
	"email" text NOT NULL,
	"parola_hash" text NOT NULL,
	"rol" "rol" DEFAULT 'ANGAJAT' NOT NULL,
	CONSTRAINT "utilizatori_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_utilizatori_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."utilizatori"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produse" ADD CONSTRAINT "produse_categorie_id_categorii_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categorii"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produse" ADD CONSTRAINT "produse_unitate_id_unitati_id_fk" FOREIGN KEY ("unitate_id") REFERENCES "public"."unitati"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sesiuni" ADD CONSTRAINT "sesiuni_user_id_utilizatori_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."utilizatori"("id") ON DELETE no action ON UPDATE no action;