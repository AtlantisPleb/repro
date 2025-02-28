# React Router v7 + Cloudflare Workers & Durable Objects Integration

This guide describes how to set up a Cloudflare Workers application using React Router v7 and integrate it with Cloudflare Durable Objects using the `agents-sdk`.

## Overview

This project template provides:

- **React Router v7** for routing and SSR.
- **Cloudflare Workers** for serverless deployment.
- **Cloudflare Durable Objects** for persistent, serverless state management.
- **Drizzle ORM** with D1 database for database interactions.
- **Tailwind CSS** for styling.
- TypeScript configured throughout the stack.

## Project Structure

```sh
├── app
│   ├── agents
│   │   └── stateful.ts # Durable Object class
│   ├── routes
│   │   └── home.tsx
│   ├── root.tsx
│   └── entry.server.tsx
├── workers
│   ├── app.ts
│   └── react-router-entry.ts
├── drizzle.config.ts
├── wrangler.toml
├── vite.config.ts
├── tsconfig.json
```

## Key Modifications to Base Template

### Durable Objects Setup

1. **Define a Durable Object Class** (`app/agents/stateful.ts`):

```typescript
import { Agent } from "agents-sdk";

export class Stateful extends Agent<Env> {
  initialState = {
    counter: 0,
    text: "",
    color: "#3B82F6",
    hello: this.env.VALUE_FROM_CLOUDFLARE,
  };
}
```

2. **Export Durable Object from Worker Entry** (`workers/app.ts`):

```typescript
import worker from "./react-router-entry";
import { Stateful } from "../app/agents/stateful";

export { Stateful };
export default worker;
```

3. **Durable Object Binding in Wrangler** (`wrangler.toml`):

```toml
[[durable_objects.bindings]]
name = "Stateful"
class_name = "Stateful"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["Stateful"]
```

### Route Durable Object Requests

Modify the React Router entry handler (`workers/react-router-entry.ts`) to route requests to Durable Objects:

```typescript
const agentResponse = await routeAgentRequest(request, {
  Stateful: env.Stateful,
});

if (agentResponse) return agentResponse;

const loadContext = getLoadContext({
  request,
  context: { cloudflare: { env, ctx } },
});

return requestHandler(request, loadContext);
```

## Environment Setup

### Installation

Install dependencies:

```sh
npm install
```

### Database

Set up Cloudflare D1 and Drizzle ORM:

```sh
npx wrangler d1 create repro-db
# Update drizzle.config.ts with DB details
npm run db:migrate
```

## Development

Run locally:

```sh
npm run dev
```

Access the app at `http://localhost:5173`.

## Build & Deploy

Create a production build:

```sh
npm run build
```

Deploy with Wrangler:

```sh
npm run deploy
```

## Troubleshooting Durable Objects

If you encounter errors like:

- `Cannot read properties of undefined (reading 'idFromName')`
- `Does not match any server namespace`

Ensure:

- Durable Object names are **lowercase** in routes (`stateful` not `Stateful`).
- Durable Object classes use explicit relative imports without aliases.
- Bindings in `wrangler.toml` exactly match class exports.

Example:

```typescript
useAgent({ agent: "stateful" }); // correct
```

## Observability & Logging

Logs are enabled via Wrangler (`wrangler.toml`):

```toml
[observability.logs]
enabled = true
```

Enhanced logging in request handlers helps debug Durable Object bindings:

```typescript
console.log("[fetch] Durable Object binding:", env.Stateful ? "✅ Exists" : "❌ Missing");
```

## Conclusion

This setup provides a solid foundation for production-ready React applications leveraging server-side rendering, persistent state, and Cloudflare's global infrastructure.
