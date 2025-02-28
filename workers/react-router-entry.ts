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
    console.log("[fetch] Request URL:", request.url);
    console.log("[fetch] Durable Object binding:", env.Stateful ? "✅ Exists" : "❌ Missing");
    console.log("[fetch] Env details:", {
      DB: !!env.DB,
      Stateful: env.Stateful,
      VALUE_FROM_CLOUDFLARE: env.VALUE_FROM_CLOUDFLARE,
    });

    if (!env.Stateful) {
      return new Response("Durable Object Binding (Stateful) is missing", { status: 500 });
    }

    let agentResponse;
    try {
      agentResponse = await routeAgentRequest(request, {
        Stateful: env.Stateful, // Explicitly passing
      });
      console.log("[routeAgentRequest] Agent response exists:", !!agentResponse);
    } catch (error) {
      console.error("[routeAgentRequest] error:", error);
      return new Response(`Agent error: ${error.message}`, { status: 500 });
    }

    if (agentResponse) {
      return agentResponse;
    }

    const loadContext = getLoadContext({
      request,
      context: { cloudflare: { env, ctx } },
    });

    console.log("[fetch] Load context initialized");

    try {
      return requestHandler(request, loadContext);
    } catch (error) {
      console.error("[requestHandler] error:", error);
      return new Response(`Handler error: ${error.message}`, { status: 500 });
    }
  },
};
