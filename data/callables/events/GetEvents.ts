import { os } from "@/data/os";
import { db } from "@/db/drizzle";
import { events } from "@/db/schema/events";
import { eq } from "drizzle-orm";

export const GetEvents = os.events.get
  .handler(async ({ context }) => {
    const userId = context.user.id;
    const allEvents = await db.query.events.findMany({
      where: eq(events.createdById, userId),
    });
    return allEvents;
  })
  .callable();
