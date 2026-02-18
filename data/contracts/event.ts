import {
  eventSchema,
  eventStatusHistorySchema,
  eventStatusReviewersSchema,
  eventStatusSchema,
  resourceSchema,
  statusTypeEnum,
  userSchema,
} from "@/db/schema/events";
import {
  newEventOutputSchema,
  newEventSchema,
  newRepoSchema,
  peopleApprovalListSchema,
} from "@/libs/schema/event.schema";
import { oc } from "@orpc/contract";
import z from "zod";
export const newEventContract = oc
  .input(newEventSchema)
  .output(newEventOutputSchema);

export const getEventsContract = oc.output(eventSchema.array());
export const getEventContract = oc
  .input(
    z.object({
      slug: z.string(),
      resourceCreatedByDefault: z.boolean().optional(),
    }),
  )
  .output(
    eventSchema.extend({
      resources: z.array(resourceSchema),
      statusHistory: z.array(eventStatusHistorySchema),
    }),
  );
export const getAllStatusesContract = oc.output(z.array(eventStatusSchema));
export const getAllPeopleApprovalListContract = oc
  .input(z.object({ statusId: z.number() }))
  .output(peopleApprovalListSchema);

export const transitionEventContract = oc
  .input(
    z.object({
      slug: z.string(),
      stage: z.enum(statusTypeEnum),
      peopleApprovalList: peopleApprovalListSchema,
    }),
  )
  .output(
    z.object({
      slug: z.string(),
      route: z.enum(statusTypeEnum),
    }),
  );

export const reviewerEventContract = oc
  .input(
    z.object({
      statusHistoryId: z.number(),
    }),
  )
  .output(
    z.array(
      eventStatusReviewersSchema.extend({
        reviewer: userSchema,
      }),
    ),
  );
export const approveEventContract = oc
  .input(
    z.object({
      statusHistoryId: z.number(),
      note: z.string().optional(),
      decision: z.enum(["approve", "reject"]),
    }),
  )
  .output(
    z.object({
      slug: z.string(),
    }),
  );
export const createNewGithubRepoContract = oc.input(newRepoSchema).output(
  z.object({
    slug: z.string(),
  }),
);
