CREATE TABLE "event_status_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"from_status_id" integer,
	"to_status_id" integer NOT NULL,
	"changed_by_id" uuid NOT NULL,
	"note" text,
	"decision" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
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
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_from_status_id_event_statuses_id_fk" FOREIGN KEY ("from_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_to_status_id_event_statuses_id_fk" FOREIGN KEY ("to_status_id") REFERENCES "public"."event_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_changed_by_id_approved_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."approved_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_approval_departments" ADD CONSTRAINT "status_approval_departments_status_id_event_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."event_statuses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_approval_departments" ADD CONSTRAINT "status_approval_departments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;