import { eventTypeEnum } from "@/db/schema/events";
import z from "zod";

export const newEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  type: z.enum(eventTypeEnum),
  slug: z.string().min(1).optional(),
});
export const newEventOutputSchema = z.object({
  slug: z.string().min(0),
});
export const getEventSchema = z.object({});
export const peopleApprovalListSchema = z.array(
  z.object({
    id: z.number().int(),
    name: z.string(),
    profile: z.url(),
    email: z.email(),
  }),
);
// export const
export const newRepoSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  eventSlug: z.string(),
});
