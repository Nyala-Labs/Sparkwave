-- First, add the supabase_id column to store the old UUID
ALTER TABLE "approved_users" ADD COLUMN "supabase_id" uuid;

-- Copy existing UUIDs to supabase_id
UPDATE "approved_users" SET "supabase_id" = "id"::uuid WHERE "supabase_id" IS NULL;

-- Make supabase_id NOT NULL and UNIQUE
ALTER TABLE "approved_users" ALTER COLUMN "supabase_id" SET NOT NULL;
ALTER TABLE "approved_users" ADD CONSTRAINT "approved_users_supabase_id_unique" UNIQUE("supabase_id");

-- Drop all foreign key constraints that reference approved_users.id
ALTER TABLE "departments" DROP CONSTRAINT IF EXISTS "departments_lead_id_approved_users_id_fk";
ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_created_by_id_approved_users_id_fk";
ALTER TABLE "event_status_history" DROP CONSTRAINT IF EXISTS "event_status_history_changed_by_id_approved_users_id_fk";
ALTER TABLE "users_to_departments" DROP CONSTRAINT IF EXISTS "users_to_departments_user_id_approved_users_id_fk";

-- Create a mapping table to track old UUID to new serial ID
CREATE TABLE "id_mapping" (
  "old_uuid" uuid PRIMARY KEY,
  "new_id" serial UNIQUE
);

-- Insert mappings with sequential numbers, ordered by creation date
INSERT INTO "id_mapping" ("old_uuid")
SELECT "supabase_id" FROM "approved_users" ORDER BY "created_at";

-- Now we have the mapping, let's create the new id column
ALTER TABLE "approved_users" ADD COLUMN "id_new" integer;

-- Update id_new with the mapped values
UPDATE "approved_users" SET "id_new" = (
  SELECT "new_id" FROM "id_mapping" WHERE "id_mapping"."old_uuid" = "approved_users"."id"::uuid
);

-- Set id_new to NOT NULL
ALTER TABLE "approved_users" ALTER COLUMN "id_new" SET NOT NULL;

-- Drop the old id (primary key)
ALTER TABLE "approved_users" DROP CONSTRAINT "approved_users_pkey";
ALTER TABLE "approved_users" DROP COLUMN "id";

-- Rename id_new to id
ALTER TABLE "approved_users" RENAME COLUMN "id_new" TO "id";

-- Add primary key on new id column
ALTER TABLE "approved_users" ADD CONSTRAINT "approved_users_pkey" PRIMARY KEY ("id");

-- Create sequence for future inserts (starting at 3, since max is currently 2)
CREATE SEQUENCE "approved_users_id_seq" START WITH 3;
ALTER TABLE "approved_users" ALTER COLUMN "id" SET DEFAULT nextval('approved_users_id_seq');

-- Update other tables to use integer for foreign keys
-- Update users_to_departments first (as it references approved_users)
ALTER TABLE "users_to_departments" ALTER COLUMN "user_id" SET DATA TYPE integer USING (
  SELECT "new_id" FROM "id_mapping" WHERE "id_mapping"."old_uuid" = "users_to_departments"."user_id"::uuid
);

-- Update events table
ALTER TABLE "events" ALTER COLUMN "created_by_id" SET DATA TYPE integer USING (
  SELECT "new_id" FROM "id_mapping" WHERE "id_mapping"."old_uuid" = "events"."created_by_id"::uuid
);

-- Update event_status_history table
ALTER TABLE "event_status_history" ALTER COLUMN "changed_by_id" SET DATA TYPE integer USING (
  SELECT "new_id" FROM "id_mapping" WHERE "id_mapping"."old_uuid" = "event_status_history"."changed_by_id"::uuid
);

-- Update departments table
ALTER TABLE "departments" ALTER COLUMN "lead_id" SET DATA TYPE integer;

-- Re-add foreign key constraints
ALTER TABLE "departments" ADD CONSTRAINT "departments_lead_id_approved_users_id_fk" FOREIGN KEY ("lead_id") REFERENCES "approved_users"("id") ON DELETE SET NULL;
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_approved_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "approved_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_changed_by_id_approved_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "approved_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "users_to_departments" ADD CONSTRAINT "users_to_departments_user_id_approved_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "approved_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Drop the temporary mapping table
DROP TABLE "id_mapping";
