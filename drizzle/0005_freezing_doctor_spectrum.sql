CREATE TABLE "vanzari" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"companie_id" integer NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vanzari_detalii" (
	"id" serial PRIMARY KEY NOT NULL,
	"vanzare_id" integer NOT NULL,
	"produs_id" integer NOT NULL,
	"cantitate" integer NOT NULL,
	"pret_unitar" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vanzari" ADD CONSTRAINT "vanzari_user_id_utilizatori_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."utilizatori"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vanzari" ADD CONSTRAINT "vanzari_companie_id_companii_id_fk" FOREIGN KEY ("companie_id") REFERENCES "public"."companii"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vanzari_detalii" ADD CONSTRAINT "vanzari_detalii_vanzare_id_vanzari_id_fk" FOREIGN KEY ("vanzare_id") REFERENCES "public"."vanzari"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vanzari_detalii" ADD CONSTRAINT "vanzari_detalii_produs_id_produse_id_fk" FOREIGN KEY ("produs_id") REFERENCES "public"."produse"("id") ON DELETE no action ON UPDATE no action;