import { createRequestHandler } from "react-router";
import { getLoadContext } from "load-context";

const requestHandler = createRequestHandler(
  // @ts-expect-error - React Router build step
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
