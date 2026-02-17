import { relations } from "drizzle-orm";
import { approvedUsers, departments } from "./approvedUsers";
import {
  eventResources,
  events,
  eventStatusHistory,
  eventStatusReviewers,
  statusApprovalDepartments,
  usersToDepartments,
} from "./events";

export const approvedUsersRelations = relations(approvedUsers, ({ many }) => ({
  eventsCreated: many(events),
  eventStatusReviewers: many(eventStatusReviewers),
  userDepartments: many(usersToDepartments),
}));
export const departmentRelations = relations(departments, ({ many }) => ({
  statusApprovals: many(statusApprovalDepartments),
  userDepartments: many(usersToDepartments),
}));
export const eventRelations = relations(events, ({ many }) => ({
  resources: many(eventResources),
  statusHistory: many(eventStatusHistory),
}));
export const eventResourcesRelations = relations(eventResources, ({ one }) => ({
  event: one(events, {
    fields: [eventResources.eventId],
    references: [events.id],
  }),
}));
export const eventStatusReviewersRelations = relations(
  eventStatusReviewers,
  ({ one }) => ({
    currentHistory: one(eventStatusHistory, {
      fields: [eventStatusReviewers.statusHistoryId],
      references: [eventStatusHistory.id],
    }),
    reviewer: one(approvedUsers, {
      fields: [eventStatusReviewers.reviewerId],
      references: [approvedUsers.id],
    }),
  }),
);
export const eventStatusHistoryRelations = relations(
  eventStatusHistory,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventStatusHistory.eventId],
      references: [events.id],
    }),
    reviewers: many(eventStatusReviewers),
  }),
);
export const statusApprovalDepartmentsRelations = relations(
  statusApprovalDepartments,
  ({ one }) => ({
    department: one(departments, {
      fields: [statusApprovalDepartments.departmentId],
      references: [departments.id],
    }),
  }),
);
export const usersToDepartmentsRelations = relations(
  usersToDepartments,
  ({ one }) => ({
    user: one(approvedUsers, {
      fields: [usersToDepartments.userId],
      references: [approvedUsers.id],
    }),
    department: one(departments, {
      fields: [usersToDepartments.departmentId],
      references: [departments.id],
    }),
  }),
);
