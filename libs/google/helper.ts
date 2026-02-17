import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { google, drive_v3, docs_v1, slides_v1, meet_v2 } from "googleapis";
import { oauth2Client } from "./client";

const GOOGLE_SESSION = "sessionData";

export type GoogleResourceType = "drive" | "docs" | "slides" | "meet";

type GoogleClientMap = {
  drive: drive_v3.Drive;
  docs: docs_v1.Docs;
  slides: slides_v1.Slides;
  meet: meet_v2.Meet;
};

export async function ReturnGoogleResource<T extends GoogleResourceType>(
  cookieStore: ReadonlyRequestCookies,
  resource: T,
): Promise<GoogleClientMap[T] | null> {
  const rawSession = cookieStore.get(GOOGLE_SESSION)?.value;
  if (!rawSession) {
    console.error("Failed to get raw session");
    return null;
  }

  let session: { accessToken: string; refreshToken: string };
  try {
    session = JSON.parse(rawSession);
  } catch {
    console.error("Failed to parse session token");
    return null;
  }

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  switch (resource) {
    case "drive":
      return google.drive({
        version: "v3",
        auth: oauth2Client,
      }) as GoogleClientMap[T];
    case "docs":
      return google.docs({
        version: "v1",
        auth: oauth2Client,
      }) as GoogleClientMap[T];
    case "slides":
      return google.slides({
        version: "v1",
        auth: oauth2Client,
      }) as GoogleClientMap[T];
    case "meet":
      return google.meet({
        version: "v2",
        auth: oauth2Client,
      }) as GoogleClientMap[T];
    default:
      console.error("Incorrect Google resource given");
      return null;
  }
}
