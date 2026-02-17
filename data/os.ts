import { authMiddleware } from "../libs/auth-middleware";
import { base } from "./base";

export const os = base.use(authMiddleware);
