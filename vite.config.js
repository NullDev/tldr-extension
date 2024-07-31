import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json" assert { type: "json" };

/* ========================= */
/* = Copyright (c) NullDev = */
/* ========================= */

export default defineConfig({
    build: {
        minify: "terser",
        // @ts-ignore
        cssMinify: "lightningcss",
    },
    plugins: [crx({ manifest })],
});
