import { os } from "@/data/os";
import { db } from "@/db/drizzle";
import { events } from "@/db/schema/events";
import { and, eq } from "drizzle-orm";

export const GetEvent = os.events.single
  .handler(async ({ input, context }) => {
    const userId = context.user.id;
    const allEvents = await db.query.events.findMany({
      where: and(eq(events.createdById, userId), eq(events.slug, input.slug)),
      with: {
        resources: true,
        statusHistory: true,
      },
    });
    const event = allEvents[0];
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  })
  .callable();
