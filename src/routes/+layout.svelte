<script lang="ts">
    import "../app.css";
    import Button from "$lib/components/ui/button/button.svelte";
    import favicon from "$lib/assets/favicon.svg";
    import { onMount } from "svelte";
    import { get_all_theme_names, selected_theme } from "$lib/helpers";
    import { get } from "svelte/store";

    let open = $state(false);
    let { children, data } = $props();

    $selected_theme = data.theme;

    onMount(() => {
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
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<header
    class="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur"
>
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
            href="/"
            class="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
            getgodly
        </a>

        <nav class="hidden md:flex items-center gap-6">
            {#each ["Lessons", "Challenges", "Leaderboard", "Resources", "Playground", "Flowchart", "Pseudo"] as label}
                <a
                    href="/{label.toLowerCase()}"
                    class="text-sm text-muted-foreground hover:text-foreground transition"
                >
                    {label}
                </a>
            {/each}
        </nav>

        <div class="hidden md:block">
            <Button variant="outline" size="sm" href="/account">Account</Button>
        </div>

        <button
            aria-label={open ? "close menu" : "open menu"}
            class="md:hidden p-2 rounded-md hover:bg-accent transition relative z-50"
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
</header>

{@render children?.()}
