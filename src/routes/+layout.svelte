<script lang="ts">
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

{@render children?.()}
