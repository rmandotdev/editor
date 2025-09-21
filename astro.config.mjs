import { defineConfig } from "astro/config";

import solid from "@astrojs/solid-js";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  integrations: [solid()],
  vite: { plugins: [tailwindcss()] },

  site: "https://editor.rman.dev",
});
