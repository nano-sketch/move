<script lang="ts">
    import { cn } from "$lib/utils";

    let {
        class: className = "",
        reverse = false,
        pauseOnHover = false,
        children,
        vertical = false,
        repeat = 4,
        ...rest
    } = $props();
</script>

<div
    {...rest}
    class={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className
    )}
>
    {#each Array(repeat) as _}
        <div
            class={cn(
                "flex shrink-0 justify-around [gap:var(--gap)]",
                vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
                reverse ? "[animation-direction:reverse]" : "",
                pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
            )}
        >
            {@render children?.()}
        </div>
    {/each}
</div>

<style>
    @keyframes marquee {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(calc(-100% - var(--gap)));
        }
    }

    @keyframes marquee-vertical {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(calc(-100% - var(--gap)));
        }
    }

    :global(.animate-marquee) {
        animation: marquee var(--duration) linear infinite;
    }

    :global(.animate-marquee-vertical) {
        animation: marquee-vertical var(--duration) linear infinite;
    }
</style>
