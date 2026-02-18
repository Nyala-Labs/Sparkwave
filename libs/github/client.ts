import { App } from "octokit";
const APP_ID = process.env.GITHUB_APP_ID!;
const PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY!;
if (!APP_ID || !PRIVATE_KEY)
  throw new Error(
    "GitHub App credentials are not set in environment variables.",
  );

const githubApp = new App({
  appId: APP_ID,
  privateKey: PRIVATE_KEY,
});
export { githubApp };
