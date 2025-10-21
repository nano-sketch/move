import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit(), tailwindcss()],
    server: {
        hmr: {
            overlay: false,
        },
    },
    build: {
        minify: "esbuild",
        cssMinify: true,
        rollupOptions: {
            output: {
                //code splitting for better caching
                manualChunks: {
                    // 'monaco': ['monaco-editor'],//single vendor chunks for better caching
                    lucide: ["lucide-svelte", "@lucide/svelte"],
                },
            },
        },
    },
    //ignore this
    optimizeDeps: {
        include: ["lucide-svelte", "@lucide/svelte"],
    },
});
