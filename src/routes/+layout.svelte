<script lang="ts">
  import { onMount } from "svelte";
  import { Sun, Moon, Languages } from "lucide-svelte";

  // internal components
  import Button from "$lib/components/ui/button/button.svelte";
  import favicon from "$lib/assets/favicon.png";
  import logo from "$lib/assets/logo-light.png";

  // state and configuration
  import { currentLang, languages, translations } from "$lib/i18n";
  import { get_all_theme_names, selected_theme } from "$lib/helpers";
  import "../app.css";

  // local component state
  let isMobileMenuOpen = $state(false);
  let isLangDropdownOpen = $state(false);
  let { children } = $props();

  /**
   * switches between light and default (dark) themes
   */
  function toggleThemeSystem() {
    selected_theme.update((current) =>
      current === "light" ? "default" : "light",
    );
  }

  // initial theme hydration on mount
  onMount(() => {
    const activeTheme = $selected_theme || "default";
    applyThemeToDocument(activeTheme);
  });

  /**
   * handles physical class injection for theme surfacing
   */
  function applyThemeToDocument(theme: string) {
    const allThemes = get_all_theme_names();
    document.documentElement.classList.remove(...allThemes);
    document.documentElement.classList.add(theme);
  }

  // reactive sync for theme changes
  $effect(() => {
    if ($selected_theme) {
      applyThemeToDocument($selected_theme);
    }
  });

  // lock scroll when mobile overlay is active
  $effect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  });

  // sync document localized attributes
  $effect(() => {
    document.documentElement.dir = $currentLang.dir;
    document.documentElement.lang = $currentLang.code;
  });

  // navigation links for menu mapping
  const navigationLinks = ["home", "services", "projects", "contact"];
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header
  class="fixed top-0 left-0 right-0 z-[201] border-b border-border bg-background/80 backdrop-blur"
>
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <a href="/" class="hover:opacity-80 transition-opacity relative z-[110]">
      <img
        src={logo}
        alt="MOVE Logo"
        class="h-12 w-auto object-contain scale-[1.8] origin-left"
      />
    </a>

    <!-- desktop navigation: centered for balance -->
    <nav
      class="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-8"
    >
      {#each navigationLinks as key}
        <a
          href={key === "home" ? "/" : `/#${key}`}
          class="text-xs font-bold tracking-widest text-muted-foreground hover:text-foreground transition-all uppercase"
        >
          {translations[$currentLang.code][key]}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-2 md:gap-4 relative z-[110]">
      <!-- theme toggle mechanism -->
      <button
        onclick={toggleThemeSystem}
        class="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors group relative overflow-hidden"
        aria-label="Toggle visual theme"
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

      <!-- localized language selection -->
      <div class="relative">
        <button
          onclick={() => (isLangDropdownOpen = !isLangDropdownOpen)}
          class="flex items-center gap-1.5 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Change documentation language"
        >
          <Languages class="w-5 h-5" />
          <span class="text-[10px] font-bold uppercase"
            >{$currentLang.code}</span
          >
        </button>

        {#if isLangDropdownOpen}
          <div
            class="absolute right-0 mt-2 w-40 bg-card border border-border rounded-2xl shadow-2xl p-2 z-[210] animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div class="space-y-1">
              {#each languages as lang}
                <button
                  onclick={() => {
                    $currentLang = lang;
                    isLangDropdownOpen = false;
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

      <!-- primary call to action -->
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

      <!-- mobile menu trigger -->
      <button
        aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
        class="md:hidden p-2 rounded-md hover:bg-accent transition relative z-[70]"
        onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {#if isMobileMenuOpen}
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

<!-- mobile navigation overlay -->
{#if isMobileMenuOpen}
  <div
    class="md:hidden fixed inset-0 z-[200] bg-background animate-in fade-in duration-300 overflow-y-auto"
  >
    <div
      class="flex flex-col items-center justify-center min-h-screen px-6 pt-20"
    >
      <nav class="flex flex-col items-center gap-10 w-full max-w-xs">
        {#each navigationLinks as key}
          <a
            href={key === "home" ? "/" : `/#${key}`}
            class="text-4xl font-black tracking-tighter text-foreground hover:text-primary transition-all duration-300 uppercase py-2"
            onclick={() => (isMobileMenuOpen = false)}
          >
            {translations[$currentLang.code][key]}
          </a>
        {/each}

        <div class="w-12 h-px bg-primary/20 my-4"></div>

        <Button
          variant="outline"
          class="w-full rounded-full py-7 font-bold text-sm tracking-widest uppercase border-2 premium-button"
          href="/#contact"
          onclick={() => (isMobileMenuOpen = false)}
        >
          {translations[$currentLang.code].get_started}
        </Button>
      </nav>
    </div>
  </div>
{/if}

{@render children?.()}
