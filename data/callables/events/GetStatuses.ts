import { os } from "@/data/os";
import { db } from "@/db/drizzle";

export const GetStatuses = os.events.statuses
  .handler(async () => {
    const statuses = await db.query.eventStatuses.findMany({});
    return statuses;
  })
  .callable();
