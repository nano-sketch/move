import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  extensions: [".svelte", ".md"],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".md"],
      highlight: { alias: { py: "python" } },
    }),
  ],

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({
			fallback: 'sub.html', // for SPA-like navigation if needed, but strict: true means all pages are generated.
      // Wait, if I use strict: true, fallback should not be needed for prerendered pages.
      // But if there are dynamic params, static build fails.
      // The user has a marketing site so it should be fine.
      pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
    alias: {
      "@/*": "/src/lib",
    },
    //nothing useful
    prerender: {
      //prerender static pages for better performance
      handleMissingId: 'warn'
    },
    csp: {
      //basic CSP for security
      mode: 'auto'
    }
  },
};

export default config;
