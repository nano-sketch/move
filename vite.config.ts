import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit(), tailwindcss()],
    server: {
        hmr: {
            overlay: false,
            // Faster HMR with reduced latency
            clientPort: 5173,
        },
        // Faster file watching
        watch: {
            usePolling: false,
            // Ignore node_modules and other heavy directories
            ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
        },
        // Faster reloads
        fs: {
            // Allow serving files from one level up to the project root
            allow: [".."],
        },
        allowedHosts: [
            "0a6d-84-66-20-122.ngrok-free.app",
        ],
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
    // Optimize dependencies for faster dev server
    optimizeDeps: {
        include: ["lucide-svelte", "@lucide/svelte"],
        // Exclude heavy dependencies from pre-bundling to speed up startup
        exclude: [
            "monaco-editor",
            "@monaco-editor/loader",
            "mermaid",
            "docx",
        ],
        // Force esbuild for faster transforms
        esbuildOptions: {
            target: "esnext",
        },
    },
    // Faster esbuild transforms
    esbuild: {
        target: "esnext",
        // Drop console and debugger in production only
        drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
    },
    ssr: {
        noExternal: ['svelte-motion']
    }
});
