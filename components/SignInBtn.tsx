"use client";
import { createClient } from "../libs/supabase/client";
export const SignInBtn = () => {
  const signIn = async () => {
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
          scope:
            "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents openid email profile",
        },
      },
    });
  };
  return (
    <button
      className="btn btn-sm rounded-full border-none bg-primary px-5 text-primary-foreground shadow-[0_0_24px_rgba(194,87,87,0.35)] hover:bg-accent text-white"
      onClick={() => signIn()}
    >
      Get Building
    </button>
  );
};
