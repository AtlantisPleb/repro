// workers/react-router-entry.ts
import { createRequestHandler } from "react-router";
import { getLoadContext } from "../load-context";

// Important: Keep virtual:react-router/server-build import here
const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  fetch(request, env, ctx) {
    const loadContext = getLoadContext({
      request,
      context: { cloudflare: { env, ctx } },
    });
    return requestHandler(request, loadContext);
  },
};
