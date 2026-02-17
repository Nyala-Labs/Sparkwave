"use client";
import { createClient } from "../libs/supabase/client";

export const SignInBtn = () => {
  const signIn = async () => {
    // Get the correct origin based on environment
    const getRedirectUrl = () => {
      if (typeof window !== "undefined") {
        // Client-side: use the current window location
        return `${window.location.origin}/auth/callback`;
      }
      // Fallback to environment variable (shouldn't reach here in practice)
      return process.env.NEXT_PUBLIC_REDIRECT_URL || "http://localhost:3000/auth/callback";
    };

    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
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
      className="btn btn-sm rounded-full border-none bg-primary px-5  shadow-[0_0_24px_rgba(194,87,87,0.35)] hover:bg-accent text-white"
      onClick={() => signIn()}
    >
      Get Building
    </button>
  );
};
