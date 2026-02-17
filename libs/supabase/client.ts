import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === "undefined") {
            return [];
          }
          const cookies: Array<{
            name: string;
            value: string;
          }> = [];
          document.cookie.split(";").forEach((cookie) => {
            const [name, ...rest] = cookie.trim().split("=");
            if (name) {
              cookies.push({ name, value: decodeURIComponent(rest.join("=")) });
            }
          });
          return cookies;
        },
        setAll(cookiesToSet) {
          if (typeof document === "undefined") {
            return;
          }
          cookiesToSet.forEach(({ name, value, options }) => {
            let cookieString = `${name}=${encodeURIComponent(value)}`;
            if (options?.maxAge) {
              cookieString += `; max-age=${options.maxAge}`;
            }
            if (options?.path) {
              cookieString += `; path=${options.path}`;
            }
            if (options?.domain) {
              cookieString += `; domain=${options.domain}`;
            }
            if (options?.sameSite) {
              cookieString += `; samesite=${options.sameSite}`;
            }
            if (options?.secure) {
              cookieString += "; secure";
            }
            document.cookie = cookieString;
          });
        },
      },
    },
  );
}
