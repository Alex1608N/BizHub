CREATE TABLE "invitatii" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"companie_id" integer NOT NULL,
	"rol" "rol" DEFAULT 'ANGAJAT' NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"inviter_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitatii" ADD CONSTRAINT "invitatii_companie_id_companii_id_fk" FOREIGN KEY ("companie_id") REFERENCES "public"."companii"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitatii" ADD CONSTRAINT "invitatii_inviter_id_utilizatori_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."utilizatori"("id") ON DELETE no action ON UPDATE no action;