<script lang="ts">
  import { Sun, Moon, Languages, ChevronDown } from "lucide-svelte";
  import { currentLang, languages, translations } from "$lib/i18n";
  import "../app.css";
  import Button from "$lib/components/ui/button/button.svelte";
  import favicon from "$lib/assets/favicon.svg";
  import { onMount } from "svelte";
  import { get_all_theme_names, selected_theme } from "$lib/helpers";
  import { get } from "svelte/store";

  let open = $state(false);
  let { children } = $props();

  function toggleTheme() {
    selected_theme.update((t) => (t === "light" ? "default" : "light"));
  }

  onMount(() => {
    // check localstorage or system preference if needed, defaulting to stored value or 'default'
    const theme = $selected_theme || "default";
    document.documentElement.classList.remove(...get_all_theme_names());
    document.documentElement.classList.add(theme);
  });

  $effect(() => {
    const theme = $selected_theme || "default";
    if (theme) {
      document.documentElement.classList.remove(...get_all_theme_names());
      document.documentElement.classList.add(theme);
    }
  });

  $effect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });
  $effect(() => {
    document.documentElement.dir = $currentLang.dir;
    document.documentElement.lang = $currentLang.code;
  });

  let langOpen = $state(false);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header
  class="fixed top-0 left-0 right-0 z-[201] border-b border-border bg-background/80 backdrop-blur"
>
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <a
      href="/"
      class="text-2xl font-black tracking-tighter text-foreground hover:opacity-80 transition-opacity relative z-[110]"
    >
      MOVE
    </a>

    <nav class="hidden md:flex items-center gap-8">
      {#each ["home", "services", "projects", "contact"] as key}
        <a
          href={key === "home" ? "/" : `/#${key}`}
          class="text-xs font-bold tracking-widest text-muted-foreground hover:text-foreground transition-all uppercase"
        >
          {translations[$currentLang.code][key]}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-2 md:gap-4 relative z-[110]">
      <button
        onclick={toggleTheme}
        class="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors group relative overflow-hidden"
        aria-label="Toggle theme"
      >
        <div class="relative w-5 h-5">
          <div
            class="absolute inset-0 transform transition-transform duration-500 {$selected_theme ===
            'light'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'}"
          >
            <Moon class="w-5 h-5 text-foreground" />
          </div>
          <div
            class="absolute inset-0 transform transition-transform duration-500 {$selected_theme !==
            'light'
              ? 'rotate-0 scale-100 opacity-100'
              : '-90 scale-0 opacity-0'}"
          >
            <Sun class="w-5 h-5 text-foreground" />
          </div>
        </div>
      </button>

      <!-- language selector -->
      <div class="relative">
        <button
          onclick={() => (langOpen = !langOpen)}
          class="flex items-center gap-1.5 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Change language"
        >
          <Languages class="w-5 h-5" />
          <span class="text-[10px] font-bold uppercase"
            >{$currentLang.code}</span
          >
        </button>

        {#if langOpen}
          <div
            class="absolute right-0 mt-2 w-40 bg-card border border-border rounded-2xl shadow-2xl p-2 z-[210] animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div class="space-y-1">
              {#each languages as lang}
                <button
                  onclick={() => {
                    $currentLang = lang;
                    langOpen = false;
                  }}
                  class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-accent {$currentLang.code ===
                  lang.code
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground'}"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-base">{lang.flag}</span>
                    {lang.name}
                  </span>
                  {#if $currentLang.code === lang.code}
                    <div class="size-1 rounded-full bg-primary"></div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="hidden md:block">
        <Button
          variant="outline"
          size="sm"
          class="rounded-full px-6 font-bold text-xs tracking-widest uppercase border-2 premium-button"
          href="/#contact"
        >
          {translations[$currentLang.code].get_started}
        </Button>
      </div>

      <button
        aria-label={open ? "close menu" : "open menu"}
        class="md:hidden p-2 rounded-md hover:bg-accent transition relative z-[70]"
        onclick={() => (open = !open)}
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {#if open}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          {/if}
        </svg>
      </button>
    </div>
  </div>
</header>

{#if open}
  <div
    class="md:hidden fixed inset-0 z-[200] mobile-menu-container animate-in fade-in duration-300 overflow-y-auto"
  >
    <div
      class="flex flex-col items-center justify-center min-h-screen px-6 pt-20"
    >
      <nav class="flex flex-col items-center gap-10 w-full max-w-xs">
        {#each ["home", "services", "projects", "contact"] as key}
          <a
            href={key === "home" ? "/" : `/#${key}`}
            class="text-4xl font-black tracking-tighter text-foreground hover:text-primary transition-all duration-300 uppercase py-2"
            onclick={() => (open = false)}
          >
            {translations[$currentLang.code][key]}
          </a>
        {/each}

        <div class="w-12 h-px bg-primary/20 my-4"></div>

        <Button
          variant="outline"
          class="w-full rounded-full py-7 font-bold text-sm tracking-widest uppercase border-2 premium-button"
          href="/#contact"
          onclick={() => (open = false)}
        >
          {translations[$currentLang.code].get_started}
        </Button>
      </nav>
    </div>
  </div>
{/if}

{@render children?.()}

<style>
  .mobile-menu-container {
    background-color: var(--background);
  }
</style>
