ALTER TABLE "categorii" DROP CONSTRAINT "categorii_nume_unique";--> statement-breakpoint
ALTER TABLE "unitati" DROP CONSTRAINT "unitati_nume_unique";--> statement-breakpoint
ALTER TABLE "unitati" DROP CONSTRAINT "unitati_simbol_unique";--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "companie_id" integer;--> statement-breakpoint
ALTER TABLE "categorii" ADD COLUMN "companie_id" integer;--> statement-breakpoint
ALTER TABLE "produse" ADD COLUMN "companie_id" integer;--> statement-breakpoint
ALTER TABLE "produse" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "unitati" ADD COLUMN "companie_id" integer;--> statement-breakpoint
ALTER TABLE "utilizatori" ADD COLUMN "companie_id" integer;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_companie_id_companii_id_fk" FOREIGN KEY ("companie_id") REFERENCES "public"."companii"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categorii" ADD CONSTRAINT "categorii_companie_id_companii_id_fk" FOREIGN KEY ("companie_id") REFERENCES "public"."companii"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produse" ADD CONSTRAINT "produse_companie_id_companii_id_fk" FOREIGN KEY ("companie_id") REFERENCES "public"."companii"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unitati" ADD CONSTRAINT "unitati_companie_id_companii_id_fk" FOREIGN KEY ("companie_id") REFERENCES "public"."companii"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utilizatori" ADD CONSTRAINT "utilizatori_companie_id_companii_id_fk" FOREIGN KEY ("companie_id") REFERENCES "public"."companii"("id") ON DELETE no action ON UPDATE no action;