import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";

export default defineConfig({
  output: "static",
  integrations: [solid()],

  site: "https://editor.rman.dev",
});
