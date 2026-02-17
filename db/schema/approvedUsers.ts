import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps } from "./helper";

export const approvedUsers = pgTable("approved_users", {
  id: serial("id").primaryKey(),
  supabaseId: uuid("supabase_id").defaultRandom().notNull().unique(),
  email: text().notNull().unique().unique(),
  claimed: boolean().default(false).notNull(),
  profile: text("profile").default("").notNull(),
  name: text("name").default("").notNull(),
  ...timestamps,
});
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  leadId: integer("lead_id").references(() => approvedUsers.id),
  ...timestamps,
});
