import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
  build: {
    rollupOptions: isSsrBuild
      ? {
        input: "./workers/app.ts",
        external: ["cloudflare:workers"],
      }
      : undefined,
  },
  ssr: {
    target: "webworker",
    noExternal: true,
    resolve: {
      conditions: ["workerd", "browser"],
    },
  },
}));


// export default defineConfig(({ isSsrBuild }) => ({
//   build: {
//     rollupOptions: isSsrBuild
//       ? {
//           input: "./workers/app.ts",
//         }
//       : undefined,
//   },
//   ssr: {
//     target: "webworker",
//     noExternal: true,
//     resolve: {
//       conditions: ["workerd", "browser"],
//     },
//     optimizeDeps: {
//       include: [
//         "react",
//         "react/jsx-runtime",
//         "react/jsx-dev-runtime",
//         "react-dom",
//         "react-dom/server",
//         "react-router",
//       ],
//     },
//   },
//   plugins: [
//     cloudflareDevProxy({
//       getLoadContext,
//     }),
//     tailwindcss(),
//     reactRouter(),
//     tsconfigPaths(),
//   ],
// }));
