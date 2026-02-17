"use server";
import { os } from "@/data/os";
import { db } from "@/db/drizzle";
import { EventResources } from "@/db/schema/event.types";
import { eventResources, events, eventStatuses } from "@/db/schema/events";
import { onError, onSuccess, ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { google } from "googleapis";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { uuidv4 } from "zod";
const ROOT_FOLDER_ID = process.env.ROOT_FOLDER_DRIVE!;
const TEMPLATE_DOC_ID = process.env.EVENT_PROPOSAL_TEMPLATE_ID!;
export const CreateEventAction = os.events.new
  .handler(async ({ input, context }) => {
    const { title, description, type: eventType } = input;
    const result = await db.transaction(async (tx) => {
      const ideationStatus = await tx.query.eventStatuses.findFirst({
        where: eq(eventStatuses.name, "Ideation"),
      });
      if (!ideationStatus) {
        throw new ORPCError("Ideation status not found");
      }
      const slug =
        slugify(title, { lower: true, strict: true }) + uuidv4().slugify();
      const [newEvent] = await tx
        .insert(events)
        .values({
          title,
          description,
          eventType,
          createdById: context.user.id,
          currentStatusId: ideationStatus.id,
          slug,
        })
        .returning();
      const drive = google.drive({ version: "v3", auth: context.oauth2Client });

      const folderRes = await drive.files.create({
        requestBody: {
          name: newEvent.title,
          parents: [ROOT_FOLDER_ID],
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id, webViewLink",
      });

      const docRes = await drive.files.copy({
        fileId: TEMPLATE_DOC_ID,
        requestBody: {
          name: `${newEvent.title} - Proposal Docs`,
          parents: [folderRes.data.id!],
        },
        fields: "id, webViewLink",
      });

      if (!docRes.data.webViewLink) {
        throw new Error("Failed to create Google Doc");
      }
      const resources: EventResources[] = [
        {
          name: `${newEvent.title} - Proposal Docs`,
          eventId: newEvent.id,
          type: "docs",
          url: docRes.data.webViewLink,
          createdByDefault: true,
        },
        {
          name: newEvent.title,
          eventId: newEvent.id,
          type: "folder",
          url: folderRes.data.webViewLink!,
          createdByDefault: true,
        },
      ];

      await tx.insert(eventResources).values(resources);
      return { newEvent };
    });
    updateTag(`event-resources-${result.newEvent.id}`);
    updateTag("events-all");
    return { slug: result.newEvent.slug };
  })
  .actionable({
    context: {
      rawSession: "",
    },
    interceptors: [
      onSuccess(async (output) => redirect(`/dashboard/events/${output.slug}`)),
      onError(async (error) => console.error(error)),
    ],
  });
