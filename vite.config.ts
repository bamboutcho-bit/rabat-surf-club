// @lovable.dev/vite-tanstack-config already provides:
// - TanStack Start
// - React
// - Tailwind
// - TypeScript paths
// - Nitro integration
// - VITE_* environment handling
// - React/TanStack deduplication
//
// Do not manually add duplicate plugins.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isLovableSandbox =
  process.env["LOVABLE_SANDBOX"] === "1" ||
  !!process.env["DEV_SERVER__PROJECT_PATH"];

export default defineConfig({
  // In the Lovable sandbox, keep the normal Cloudflare setup.
  //
  // Outside Lovable (including our local production test and
  // GitHub Actions), disable the Nitro server build so that
  // TanStack Start can produce a static website.
  nitro: isLovableSandbox ? undefined : false,

  tanstackStart: isLovableSandbox
    ? {
        server: {
          entry: "server",
        },
      }
    : {
        server: {
          entry: "server",
        },

        prerender: {
          enabled: true,
          crawlLinks: true,
          autoStaticPathsDiscovery: true,
          autoSubfolderIndex: true,
          retryCount: 2,
          retryDelay: 1000,
          failOnError: true,
        },

        pages: [
          {
            path: "/",
          },
        ],
      },

  vite: {
    base: "/rabat-surf-club/",
  },
});