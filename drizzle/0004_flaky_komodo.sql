CREATE TABLE "pontaj" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"companie_id" integer NOT NULL,
	"tip" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pontaj" ADD CONSTRAINT "pontaj_user_id_utilizatori_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."utilizatori"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pontaj" ADD CONSTRAINT "pontaj_companie_id_companii_id_fk" FOREIGN KEY ("companie_id") REFERENCES "public"."companii"("id") ON DELETE no action ON UPDATE no action;