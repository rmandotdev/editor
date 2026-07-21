import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [solid()],
  vite: {
    plugins: [tailwindcss()],
    build: { cssTarget: "safari15", target: "safari15" },
  },
  site: "https://editor.rman.dev",
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Cousine",
      cssVariable: "--font-cousine",
    },
  ],
});
