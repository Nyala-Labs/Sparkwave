import { router } from "@/data";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { ContractRouterClient } from "@orpc/contract";

const link = new RPCLink({
  url: `${typeof window !== "undefined" ? window.location.origin : process.env.BASE_URL}/rpc`,
  headers: async () => {
    if (typeof window !== "undefined") {
      return {};
    }

    const { headers } = await import("next/headers");
    return await headers();
  },
});
export const client: ContractRouterClient<typeof router> =
  createORPCClient(link);
