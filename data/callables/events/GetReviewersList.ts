import { os } from "@/data/os";
import { db } from "@/db/drizzle";
import { eventStatusReviewers } from "@/db/schema/events";
import { eq } from "drizzle-orm";

export const GetReviewersList = os.events.getReviewers
  .handler(async ({ input }) => {
    const reviewers = await db.query.eventStatusReviewers.findMany({
      where: eq(eventStatusReviewers.statusHistoryId, input.statusHistoryId),
      with: {
        reviewer: true,
      },
    });
    return reviewers;
  })
  .callable();
