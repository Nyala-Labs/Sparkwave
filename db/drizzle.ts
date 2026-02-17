import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import * as userSchema from "./schema/approvedUsers";
import * as eventSchemas from "./schema/events";
import * as eventTypes from "./schema/event.types";
import * as eventRelations from "./schema/event.relations";
config({ path: ".env" });

export const db = drizzle(process.env.DATABASE_URL!, {
  casing: "snake_case",
  schema: { ...userSchema, ...eventSchemas, ...eventTypes, ...eventRelations },
});
