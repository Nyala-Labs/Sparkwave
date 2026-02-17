import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { approvedUsers, departments } from "./approvedUsers";
import { timestamps } from "./helper";
export const eventTypeEnum = [
  "workshop",
  "talk",
  "hackathon",
  "series",
  "others",
] as const;
export type EventTypeEnum = (typeof eventTypeEnum)[number];
export const events = pgTable(
  "events",
  {
    id: serial().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    currentStatusId: integer("current_status_id")
      .notNull()
      .references(() => eventStatuses.id),
    ...timestamps,
    eventType: text("event_type", { enum: eventTypeEnum }).notNull(),
    createdById: integer("created_by_id")
      .notNull()
      .references(() => approvedUsers.id),
  },
  (t) => [index("idx_events_status").on(t.currentStatusId)],
);
export const eventStatuses = pgTable("event_statuses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  orderIndex: integer("order_index").notNull(),
  ...timestamps,
});

export const resourceTypeEnum = [
  "docs",
  "sheet",
  "slides",
  "others",
  "folder",
] as const;
export const statusTypeEnum = [
  "ideation",
  "prototype",
  "production",
  "pre-event",
  "event",
  "post-event",
] as const;

export const eventResources = pgTable(
  "event_resources",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    createdByDefault: boolean("created_by_default").notNull().default(false),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    type: text("type", { enum: resourceTypeEnum }).notNull(),
    ...timestamps,
  },
  (t) => [
    unique().on(t.name, t.eventId),
    index("idx_event_resources_event").on(t.eventId),
  ],
);

export const eventStatusTransitions = pgTable(
  "event_status_transitions",
  {
    id: serial("id").primaryKey(),
    fromStatusId: integer("from_status_id")
      .notNull()
      .references(() => eventStatuses.id, { onDelete: "cascade" }),
    toStatusId: integer("to_status_id")
      .notNull()
      .references(() => eventStatuses.id, { onDelete: "cascade" }),
  },
  (t) => [
    unique().on(t.fromStatusId, t.toStatusId),
    index("idx_status_transitions_from").on(t.fromStatusId),
    index("idx_status_transitions_to").on(t.toStatusId),
  ],
);

export const eventStatusHistory = pgTable("event_status_history", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),

  fromStatusId: integer("from_status_id").references(() => eventStatuses.id),

  toStatusId: integer("to_status_id")
    .notNull()
    .references(() => eventStatuses.id),

  changedById: integer("changed_by_id")
    .notNull()
    .references(() => approvedUsers.id),

  note: text("note"),

  decision: text("decision", {
    enum: ["submitted", "approved", "rejected"],
  }).notNull(),

  ...timestamps,
});
export const eventStatusReviewers = pgTable(
  "event_status_reviewers",
  {
    id: serial("id").primaryKey(),

    statusHistoryId: integer("status_history_id")
      .notNull()
      .references(() => eventStatusHistory.id, { onDelete: "cascade" }),

    reviewerId: integer("reviewer_id")
      .notNull()
      .references(() => approvedUsers.id, { onDelete: "cascade" }),

    decision: text("decision", {
      enum: ["pending", "approved", "rejected"],
    })
      .notNull()
      .default("pending"),

    note: text("note"),

    ...timestamps,
  },
  (t) => [
    unique().on(t.statusHistoryId, t.reviewerId),
    index("idx_status_reviewers_history").on(t.statusHistoryId),
  ],
);
export const statusApprovalDepartments = pgTable(
  "status_approval_departments",
  {
    id: serial("id").primaryKey(),

    statusId: integer("status_id")
      .notNull()
      .references(() => eventStatuses.id, { onDelete: "cascade" }),

    departmentId: integer("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "cascade" }),

    ...timestamps,
  },
);
export const usersToDepartments = pgTable(
  "users_to_departments",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => approvedUsers.id),
    departmentId: integer("department_id")
      .notNull()
      .references(() => departments.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.departmentId] })],
);

export const eventSchema = createSelectSchema(events);
export const userSchema = createSelectSchema(approvedUsers);
export const resourceSchema = createSelectSchema(eventResources);
export const resourceInsertSchema = createSelectSchema(eventResources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export const eventStatusSchema = createSelectSchema(eventStatuses);
export const eventStatusHistorySchema = createSelectSchema(eventStatusHistory);
export const eventStatusReviewersSchema =
  createSelectSchema(eventStatusReviewers);
