import { db } from "@/db/drizzle";
import { approvedUsers } from "@/db/schema/approvedUsers";
import { createClient } from "../../../libs/supabase/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) next = "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();
  const { data: sessionData, error } =
    await supabase.auth.exchangeCodeForSession(code);
  if (error || !sessionData?.session) {
    console.error("Error exchanging code for session:", error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const user = sessionData.session.user;
  const email = user.email;
  if (!email) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const approvedUser = await db.query.approvedUsers.findFirst({
    where: eq(approvedUsers.email, email),
  });

  if (!approvedUser) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
  console.log(user.user_metadata);
  if (!approvedUser.claimed) {
    try {
      await db
        .update(approvedUsers)
        .set({
          claimed: true,
          supabaseId: user.id,
          name: user.user_metadata.full_name || "",
          profile: user.user_metadata.avatar_url || "",
        })
        .where(eq(approvedUsers.id, approvedUser.id));
    } catch (err) {
      console.error(
        "Failed to toggle claimed for approved user",
        approvedUser.id,
        err,
      );
    }
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const redirectUrl = isLocalEnv
    ? `${origin}${next}`
    : forwardedHost
      ? `https://${forwardedHost}${next}`
      : `${origin}${next}`;

  const res = NextResponse.redirect(redirectUrl);

  // Set provider tokens as custom cookie (if available)
  if (sessionData.session.provider_token) {
    res.cookies.set({
      name: "sessionData",
      value: JSON.stringify({
        accessToken: sessionData.session.provider_token,
        refreshToken: sessionData.session.provider_refresh_token,
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: sessionData.session.expires_at
        ? sessionData.session.expires_at - Math.floor(Date.now() / 1000)
        : undefined,
    });
  }

  return res;
}
