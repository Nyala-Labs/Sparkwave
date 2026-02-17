CREATE TABLE "approved_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"supabase_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"profile" text DEFAULT '' NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "approved_users_supabase_id_unique" UNIQUE("supabase_id"),
	CONSTRAINT "approved_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lead_id" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "event_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_by_default" boolean DEFAULT false NOT NULL,
	"event_id" integer NOT NULL,
	"url" text NOT NULL,
	"type" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "event_resources_name_event_id_unique" UNIQUE("name","event_id")
);
--> statement-breakpoint
CREATE TABLE "event_status_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"from_status_id" integer,
	"to_status_id" integer NOT NULL,
	"changed_by_id" integer NOT NULL,
	"note" text,
	"decision" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "event_status_reviewers" (
	"id" serial PRIMARY KEY NOT NULL,
	"status_history_id" integer NOT NULL,
	"reviewer_id" integer NOT NULL,
	"decision" text DEFAULT 'pending' NOT NULL,
	"note" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "event_status_reviewers_status_history_id_reviewer_id_unique" UNIQUE("status_history_id","reviewer_id")
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
	"created_by_id" integer NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "status_approval_departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"status_id" integer NOT NULL,
	"department_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users_to_departments" (
	"user_id" integer NOT NULL,
	"department_id" integer NOT NULL,
	CONSTRAINT "users_to_departments_user_id_department_id_pk" PRIMARY KEY("user_id","department_id")
);
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_lead_id_approved_users_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."approved_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_resources" ADD CONSTRAINT "event_resources_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_from_status_id_event_statuses_id_fk" FOREIGN KEY ("from_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_to_status_id_event_statuses_id_fk" FOREIGN KEY ("to_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_changed_by_id_approved_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."approved_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_reviewers" ADD CONSTRAINT "event_status_reviewers_status_history_id_event_status_history_id_fk" FOREIGN KEY ("status_history_id") REFERENCES "public"."event_status_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_reviewers" ADD CONSTRAINT "event_status_reviewers_reviewer_id_approved_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."approved_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_transitions" ADD CONSTRAINT "event_status_transitions_from_status_id_event_statuses_id_fk" FOREIGN KEY ("from_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_transitions" ADD CONSTRAINT "event_status_transitions_to_status_id_event_statuses_id_fk" FOREIGN KEY ("to_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_current_status_id_event_statuses_id_fk" FOREIGN KEY ("current_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_approved_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."approved_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_approval_departments" ADD CONSTRAINT "status_approval_departments_status_id_event_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."event_statuses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_approval_departments" ADD CONSTRAINT "status_approval_departments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_departments" ADD CONSTRAINT "users_to_departments_user_id_approved_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."approved_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_departments" ADD CONSTRAINT "users_to_departments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_event_resources_event" ON "event_resources" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_status_reviewers_history" ON "event_status_reviewers" USING btree ("status_history_id");--> statement-breakpoint
CREATE INDEX "idx_status_transitions_from" ON "event_status_transitions" USING btree ("from_status_id");--> statement-breakpoint
CREATE INDEX "idx_status_transitions_to" ON "event_status_transitions" USING btree ("to_status_id");--> statement-breakpoint
CREATE INDEX "idx_events_status" ON "events" USING btree ("current_status_id");