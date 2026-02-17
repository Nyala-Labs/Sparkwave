import { base } from "@/data/base";
import { approvedUsers } from "@/db/schema/approvedUsers";
import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { db } from "../db/drizzle";
import { createClient } from "./supabase/server";
const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

export const authMiddleware = base.middleware(async ({ next }) => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) throw new ORPCError("UNAUTHORIZED");
  const cookieStore = await cookies();
  const rawSession = cookieStore.get("sessionData")?.value;
  if (!rawSession) {
    throw new ORPCError("UNAUTHORIZED", { message: "No session data" });
  }

  let session: { accessToken: string; refreshToken: string };
  try {
    session = JSON.parse(rawSession);
  } catch {
    throw new ORPCError("UNAUTHORIZED", { message: "Invalid session format" });
  }

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });
  const approvedUser = await db.query.approvedUsers.findFirst({
    where: eq(approvedUsers.supabaseId, user.id),
  });
  if (!approvedUser)
    throw new ORPCError("FORBIDDEN", { message: "User is not approved" });
  const result = await next({
    context: {
      user: approvedUser,
      oauth2Client,
    },
  });
  return result;
});
