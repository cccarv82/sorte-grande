CREATE TABLE "lottery_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"lottery" text NOT NULL,
	"contest_number" integer NOT NULL,
	"draw_numbers" integer[] NOT NULL,
	"draw_date" date NOT NULL,
	"prizes" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_lottery_results_contest" UNIQUE("lottery","contest_number")
);
--> statement-breakpoint
CREATE TABLE "prizes" (
	"id" serial PRIMARY KEY NOT NULL,
	"suggestion_id" integer NOT NULL,
	"game_index" integer NOT NULL,
	"contest_number" integer NOT NULL,
	"prize_tier" text NOT NULL,
	"prize_value" integer,
	"matched_numbers" integer[] NOT NULL,
	"viewed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suggestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lottery" text NOT NULL,
	"value" integer NOT NULL,
	"games" jsonb NOT NULL,
	"wheel_template" text,
	"guarantee" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"contest_number" integer,
	"created_at" timestamp DEFAULT now(),
	"realized_at" timestamp,
	"verified_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"email_verified" timestamp,
	"image" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_suggestion_id_suggestions_id_fk" FOREIGN KEY ("suggestion_id") REFERENCES "public"."suggestions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_lottery_results_lottery" ON "lottery_results" USING btree ("lottery");--> statement-breakpoint
CREATE INDEX "idx_lottery_results_draw_date" ON "lottery_results" USING btree ("draw_date");--> statement-breakpoint
CREATE INDEX "idx_prizes_suggestion_id" ON "prizes" USING btree ("suggestion_id");--> statement-breakpoint
CREATE INDEX "idx_suggestions_user_id" ON "suggestions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_suggestions_status" ON "suggestions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");