import { google } from "googleapis";

export const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);
