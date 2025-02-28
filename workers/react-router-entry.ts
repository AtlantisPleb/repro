import { createRequestHandler } from "react-router";
import { getLoadContext } from "../load-context";
import { routeAgentRequest } from "agents-sdk";
import { Stateful } from "../app/agents/stateful";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export { Stateful };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const upgradeHeader = request.headers.get("Upgrade");

    // Provide Durable Object namespace explicitly to agent SDK
    const agentResponse = await routeAgentRequest(request, {
      Stateful: env.Stateful,  // explicitly pass Durable Object namespace
    });

    if (agentResponse) {
      return agentResponse;
    }

    const loadContext = getLoadContext({
      request,
      context: { cloudflare: { env, ctx } },
    });

    return requestHandler(request, loadContext);
  },
};
