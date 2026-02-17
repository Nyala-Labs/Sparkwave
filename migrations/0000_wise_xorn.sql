CREATE TABLE "approved_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "approved_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lead_id" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"department_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"event_id" integer NOT NULL,
	"url" text NOT NULL,
	"type" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "event_resources_name_event_id_unique" UNIQUE("name","event_id")
);
--> statement-breakpoint
CREATE TABLE "event_status_transitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_status_id" integer NOT NULL,
	"to_status_id" integer NOT NULL,
	CONSTRAINT "event_status_transitions_from_status_id_to_status_id_unique" UNIQUE("from_status_id","to_status_id")
);
--> statement-breakpoint
CREATE TABLE "event_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"order_index" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "event_statuses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"current_status_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"event_type" text NOT NULL,
	"created_by_id" uuid NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_lead_id_approved_users_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."approved_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_departments" ADD CONSTRAINT "user_departments_user_id_approved_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."approved_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_departments" ADD CONSTRAINT "user_departments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_resources" ADD CONSTRAINT "event_resources_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_transitions" ADD CONSTRAINT "event_status_transitions_from_status_id_event_statuses_id_fk" FOREIGN KEY ("from_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_transitions" ADD CONSTRAINT "event_status_transitions_to_status_id_event_statuses_id_fk" FOREIGN KEY ("to_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_current_status_id_event_statuses_id_fk" FOREIGN KEY ("current_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_approved_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."approved_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_event_resources_event" ON "event_resources" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_status_transitions_from" ON "event_status_transitions" USING btree ("from_status_id");--> statement-breakpoint
CREATE INDEX "idx_status_transitions_to" ON "event_status_transitions" USING btree ("to_status_id");--> statement-breakpoint
CREATE INDEX "idx_events_status" ON "events" USING btree ("current_status_id");