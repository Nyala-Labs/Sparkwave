"use server";
import { os } from "@/data/os";
import { db } from "@/db/drizzle";
import { approvedUsers } from "@/db/schema/approvedUsers";
import {
  eventStatusHistory,
  eventStatusReviewers,
  events,
} from "@/db/schema/events";
import { onError, onSuccess, ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const ApproveStateChangeAction = os.events.approve
  .handler(async ({ input, context }) => {
    const { decision, statusHistoryId, note } = input;

    return await db.transaction(async (tx) => {
      const user = await tx.query.approvedUsers.findFirst({
        where: eq(approvedUsers.id, context.user.id),
      });

      if (!user) throw new ORPCError("User not authorized to review");

      const review = await tx.query.eventStatusReviewers.findFirst({
        where: eq(eventStatusReviewers.statusHistoryId, statusHistoryId),
      });

      if (!review) throw new ORPCError("Review not found");

      if (review.reviewerId !== user.id) {
        throw new ORPCError("User not authorized to review this status change");
      }

      const decisionValue = decision === "approve" ? "approved" : "rejected";

      await tx
        .update(eventStatusReviewers)
        .set({
          decision: decisionValue,
          note,
        })
        .where(eq(eventStatusReviewers.id, review.id));

      const [eventHistory] = await tx
        .update(eventStatusHistory)
        .set({
          decision: decisionValue,
          note,
        })
        .where(eq(eventStatusHistory.id, statusHistoryId))
        .returning();

      if (!eventHistory) {
        throw new ORPCError("Event history not found");
      }

      const [event] = await tx
        .update(events)
        .set({
          currentStatusId: eventHistory.toStatusId,
        })
        .where(eq(events.id, eventHistory.eventId))
        .returning();
      if (!event) throw new ORPCError("Event not found");

      return { slug: event.slug };
    });
  })
  .actionable({
    interceptors: [
      onSuccess(async (output) => redirect(`/dashboard/events/${output.slug}`)),
      onError(async (error) => console.error(error)),
    ],
  });
