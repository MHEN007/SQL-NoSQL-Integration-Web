ALTER TABLE "products" ALTER COLUMN "wishlists" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "owner_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;