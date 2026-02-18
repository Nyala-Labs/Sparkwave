"use server";
import { os } from "@/data/os";
import { db } from "@/db/drizzle";
import { eventResources, events } from "@/db/schema/events";
import { githubApp } from "@/libs/github/client";
import { onError, onSuccess, ORPCError } from "@orpc/client";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
const INSTALLATION_ID = process.env
  .GITHUB_APP_INSTALLATION_ID! as unknown as number;

export const CreateGithubRepoAction = os.events.createGithubRepo
  .handler(async ({ input }) => {
    const event = await db.query.events.findFirst({
      where: eq(events.slug, input.eventSlug),
    });
    if (!event) throw new ORPCError("Event not found");
    const existingRepo = await db.query.eventResources.findFirst({
      where: and(
        eq(eventResources.eventId, event.id),
        eq(eventResources.type, "github"),
      ),
    });
    if (existingRepo) throw new ORPCError("Github repository already exists");

    console.log(INSTALLATION_ID);
    const octokit = await githubApp.getInstallationOctokit(INSTALLATION_ID);

    const res = await octokit.request("POST /orgs/Nyala-Labs/repos", {
      org: "Nyala-Labs",
      name: input.title,
      description: input.description,
      homepage: "https://github.com",
      private: true,
      has_issues: true,
      has_projects: false,
      has_wiki: false,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    console.log(res.data);

    if (!res.status || res.status >= 300)
      throw new ORPCError("Failed to create Github repository");
    const [newRepo] = await db
      .insert(eventResources)
      .values({
        eventId: event.id,
        type: "github",
        url: res.data["html_url"],
        name: input.title,
      })
      .returning();
    if (!newRepo) throw new ORPCError("Failed to save Github repository");
    return { slug: event.slug };
  })
  .actionable({
    interceptors: [
      onSuccess(async (output) => redirect(`/dashboard/events/${output.slug}`)),
      onError(async (error) => console.error(error)),
    ],
  });
