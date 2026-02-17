import { implement } from "@orpc/server";
import { routerContract } from "./contracts";

export const base = implement(routerContract);
