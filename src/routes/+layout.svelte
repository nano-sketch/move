<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import "../app.css";
    import favicon from "$lib/assets/favicon.svg";

    onMount(() => {
        document.documentElement.classList.add("dark");
    });

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<header class="relative z-10 border-b border-border bg-card/80 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-12">
            <a href="/" class="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all duration-300">
                getgodly
            </a>
            <nav class="flex items-center gap-8">
                <a href="/lessons" class="text-sm text-muted-foreground hover:text-foreground transition-colors">lessons</a>
                <a href="/challenges" class="text-sm text-muted-foreground hover:text-foreground transition-colors">challenges</a>
                <a href="/resources" class="text-sm text-muted-foreground hover:text-foreground transition-colors">resources</a>
                <a href="/playground" class="text-sm text-muted-foreground hover:text-foreground transition-colors">playground</a>
                <a href="/flowchart" class="text-sm text-muted-foreground hover:text-foreground transition-colors">flowchart</a>
                <a href="/pseudo" class="text-sm text-muted-foreground hover:text-foreground transition-colors">pseudo</a>
                <a href="/hall" class="text-sm text-muted-foreground hover:text-foreground transition-colors">hall</a>
            </nav>
        </div>
        <Button variant="outline" size="sm" href="/account">account</Button>
    </div>
</header>

{@render children?.()}
