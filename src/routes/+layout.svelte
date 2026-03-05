<script lang="ts">
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { Sun, Moon, Languages } from "lucide-svelte";

  // internal components
  import Button from "$lib/components/ui/button/button.svelte";
  import ButtonBackgroundShine from "$lib/components/ui/button-background-shine/ButtonBackgroundShine.svelte";
  import favicon from "$lib/assets/favicon.png";
  import logo from "$lib/assets/logo-light.png";
  import ContactPopup from "$lib/components/misc/ContactPopup.svelte";
  import FramerBackground from "$lib/components/misc/FramerBackground.svelte";
  import Separator from "$lib/components/misc/Separator.svelte";

  // state and configuration
  import { currentLang, languages, translations } from "$lib/i18n";
  import {
    get_all_theme_names,
    selected_theme,
    contact_popup_open,
  } from "$lib/helpers";
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
  const navigationLinks = [
    "home",
    "services",
    "reviews",
    "about",
    "why_us",
    "projects",
    "contact",
    "faq",
  ];
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header
  class="fixed top-0 left-0 right-0 z-[201] h-[91px] px-6 lg:px-[50px] flex items-center backdrop-blur-md bg-black/30"
>
  <div class="w-full flex items-center justify-between">
    <!-- LEFT SIDE: Logo & Nav -->
    <div class="flex items-center gap-6 lg:gap-[40px]">
      <a
        href="/"
        class="hover:opacity-80 transition-opacity flex items-center h-full"
      >
        <img
          src={logo}
          alt="MOVE Logo"
          class="h-10 lg:h-12 w-auto object-contain scale-[1.8] origin-left select-none"
          draggable="false"
        />
      </a>

      <!-- vertical separator -->
      <div class="hidden lg:block w-px h-[24px] bg-white/10"></div>

      <!-- desktop navigation -->
      <nav class="hidden lg:flex items-center gap-[25px]">
        {#each navigationLinks as key}
          <a
            href={key === "home" ? "/" : `/#${key.replace("_", "-")}`}
            class="text-[16px] text-white hover:text-white/80 transition-all select-none font-medium capitalize"
          >
            <span class="lowercase block first-letter:uppercase">
              {translations[$currentLang.code][key]}
            </span>
          </a>
        {/each}
      </nav>
    </div>

    <!-- RIGHT SIDE: Tools & CTA -->
    <div class="flex items-center gap-2 md:gap-4 relative z-[110]">
      <!-- localized language selection -->
      <div class="relative">
        <button
          onclick={() => (isLangDropdownOpen = !isLangDropdownOpen)}
          class="flex items-center gap-1.5 py-2 px-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors select-none"
          aria-label="Change language"
        >
          <Languages class="w-4 h-4" />
          <span class="text-[13px] font-bold uppercase"
            >{$currentLang.code}</span
          >
        </button>

        {#if isLangDropdownOpen}
          <div
            class="absolute right-0 mt-2 w-40 bg-black/40 border border-white/10 rounded-2xl p-2 z-[210] animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-sm"
          >
            <div class="space-y-1">
              {#each languages as lang}
                <button
                  onclick={() => {
                    $currentLang = lang;
                    isLangDropdownOpen = false;
                  }}
                  class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-white/5 select-none {$currentLang.code ===
                  lang.code
                    ? 'text-primary bg-white/10'
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
        <ButtonBackgroundShine
          text={translations[$currentLang.code].get_started}
          onclick={() => ($contact_popup_open = true)}
        />
      </div>

      <!-- mobile menu trigger -->
      <button
        aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
        class="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors duration-300 relative z-[70]"
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

  <div class="absolute bottom-0 left-0 w-full translate-y-full">
    <Separator gradient={true} />
  </div>
</header>

<!-- mobile navigation overlay -->
{#if isMobileMenuOpen}
  <div
    class="md:hidden fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm"
    transition:fade={{ duration: 300 }}
  >
    <div
      class="flex flex-col items-center justify-start min-h-screen px-6 pt-32 pb-20"
      transition:scale={{ duration: 400, start: 1.05, opacity: 0 }}
    >
      <nav class="flex flex-col items-center gap-6 w-full max-w-xs">
        {#each navigationLinks as key}
          <a
            href={key === "home" ? "/" : `/#${key.replace("_", "-")}`}
            class="text-3xl font-black tracking-tighter text-foreground hover:text-primary transition-all duration-300 uppercase py-1 select-none"
            onclick={() => (isMobileMenuOpen = false)}
          >
            {translations[$currentLang.code][key]}
          </a>
        {/each}

        <div class="w-12 h-px bg-primary/20 my-2"></div>

        <Button
          variant="outline"
          class="w-full rounded-full py-6 font-bold text-sm tracking-widest uppercase border-2 premium-button select-none"
          onclick={() => {
            isMobileMenuOpen = false;
            $contact_popup_open = true;
          }}
        >
          {translations[$currentLang.code].get_started}
        </Button>
      </nav>
    </div>
  </div>
{/if}

<ContactPopup bind:isOpen={$contact_popup_open} />

<FramerBackground />

{@render children?.()}
