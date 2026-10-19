import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const fromHere = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolves the `@/*` alias straight from tsconfig.json (Vite 8 built-in).
    tsconfigPaths: true,
    alias: {
      // `server-only` throws outside a React Server environment; tests import
      // server modules directly, so use the package's own no-op entry (the one
      // its "react-server" export condition points at).
      "server-only": fromHere("./node_modules/server-only/empty.js"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [fromHere("./vitest.setup.ts")],
    include: ["src/**/*.test.{ts,tsx}"],
    // Importing jsdom costs ~5s per worker on Windows (AV scanning). Reusing the
    // environment per worker cuts the suite from ~2 min to well under one; every
    // file restores its own mocks/stubs and the setup file resets the DOM.
    isolate: false,
    pool: "threads",
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
    css: false,
  },
});
