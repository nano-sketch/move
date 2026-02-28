import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  server: {
    hmr: {
      overlay: false,
      clientPort: 5173,
    },
    watch: {
      usePolling: false,
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    },
    fs: {
      allow: [".."],
    },
    allowedHosts: ["2325-84-69-17-8.ngrok-free.app"],
  },
  build: {
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          lucide: ["lucide-svelte", "@lucide/svelte"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["lucide-svelte", "@lucide/svelte"],
    exclude: ["monaco-editor", "@monaco-editor/loader", "mermaid", "docx"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  esbuild: {
    target: "esnext",
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  ssr: {
    noExternal: ["svelte-motion"],
  },
});
