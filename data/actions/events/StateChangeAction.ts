"use server";

import { GetEvent } from "@/data/callables/events/GetEvent";
import { os } from "@/data/os";
import { db } from "@/db/drizzle";
import {
  events,
  eventStatuses,
  eventStatusHistory,
  eventStatusTransitions,
} from "@/db/schema/events";
import { onError, onSuccess, ORPCError } from "@orpc/client";
import { and, eq, ilike } from "drizzle-orm";
import { redirect } from "next/navigation";

export const StateChangeAction = os.events.transition
  .handler(async ({ input, context }) => {
    await db.transaction(async (tx) => {
      const event = await GetEvent({ slug: input.slug });
      if (!event) throw new ORPCError("Event not found");

      const lastHistory = await tx.query.eventStatusHistory.findFirst({
        where: eq(eventStatusHistory.eventId, event.id),
        orderBy: (fields, { desc }) => [desc(fields.createdAt)],
      });

      const targetStatus = await tx.query.eventStatuses.findFirst({
        where: ilike(eventStatuses.name, input.stage),
      });

      if (!targetStatus) throw new ORPCError("Target status not found");

      if (lastHistory?.decision === "rejected") {
        await tx
          .update(eventStatusHistory)
          .set({ decision: "submitted" })
          .where(eq(eventStatusHistory.id, lastHistory.id));

        return event;
      }

      if (!lastHistory) {
        if (event.currentStatusId !== targetStatus.id)
          throw new ORPCError("Invalid initial stage");

        const transition = await tx.query.eventStatusTransitions.findFirst({
          where: eq(eventStatusTransitions.fromStatusId, event.currentStatusId),
        });

        if (!transition) throw new ORPCError("No valid transition found");

        await tx.insert(eventStatusHistory).values({
          eventId: event.id,
          changedById: context.user.id,
          fromStatusId: event.currentStatusId,
          toStatusId: transition.toStatusId,
          decision: "submitted",
        });

        await tx
          .update(events)
          .set({ currentStatusId: transition.toStatusId })
          .where(eq(events.id, event.id));

        return event;
      }

      const transition = await tx.query.eventStatusTransitions.findFirst({
        where: and(
          eq(eventStatusTransitions.fromStatusId, event.currentStatusId),
          eq(eventStatusTransitions.toStatusId, targetStatus.id),
        ),
      });

      if (!transition) throw new ORPCError("Invalid status transition");

      await tx.insert(eventStatusHistory).values({
        eventId: event.id,
        changedById: context.user.id,
        fromStatusId: event.currentStatusId,
        toStatusId: targetStatus.id,
        decision: "submitted",
      });

      await tx
        .update(events)
        .set({ currentStatusId: targetStatus.id })
        .where(eq(events.id, event.id));

      return event;
    });
    return {
      slug: input.slug,
      route: input.stage,
    };
  })
  .actionable({
    interceptors: [
      onSuccess(async (output) =>
        redirect(`/dashboard/events/${output.slug}/${output.route}`),
      ),
      onError(async (error) => console.error(error)),
    ],
  });
