<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // Svelte 5 Code : https://svelte.dev/playground/39866a136f0d4268821e5ae901dce47f?version=5.0.5

  export let collapseDelay = 5000;
  export let ltr = false;
  export let linePosition: "left" | "right" | "top" | "bottom" = "left";
  export let data: Array<{
    id: number;
    title: string;
    content: string;
    image?: string;
    video?: string;
    icon?: any;
  }> = [];

  let currentIndex = writable(-1);

  onMount(() => {
    let timer = setTimeout(() => {
      currentIndex.set(0);
    }, 100);
    return () => clearTimeout(timer);
  });

  onMount(() => {
    const handleAutoScroll = () => {
      currentIndex.update((prevIndex) =>
        prevIndex !== undefined ? (prevIndex + 1) % data.length : 0,
      );
    };
    const autoScrollTimer = setInterval(handleAutoScroll, collapseDelay);
    return () => clearInterval(autoScrollTimer);
  });
</script>

<div id="features" class="w-full">
  <div class="flex flex-col gap-10">
    <div class="w-full">
      <div class="space-y-3">
        {#each data as item, index}
          <div
            class="relative flex items-center group/item cursor-pointer"
            onclick={() => currentIndex.set(index)}
          >
            {#if linePosition === "left" || linePosition === "right"}
              <div
                class="absolute inset-y-0 h-full w-0.5 overflow-hidden rounded-lg bg-white/10 {linePosition ===
                'right'
                  ? 'left-auto right-0'
                  : 'left-0 right-auto'}"
              >
                <div
                  class="absolute left-0 top-0 w-full {$currentIndex === index
                    ? 'h-full'
                    : 'h-0'} origin-top bg-white transition-all ease-linear"
                  style="transition-duration: {$currentIndex === index
                    ? `${collapseDelay}ms`
                    : '0s'};"
                ></div>
              </div>
            {/if}

            <div
              class="item-box mx-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-all duration-500"
            >
              <svelte:component this={item.icon} class="size-4 text-primary" />
            </div>

            <div class="flex-1 space-y-0.5 min-w-0">
              <h3
                class="text-[1.05rem] font-bold tracking-tight text-foreground transition-colors"
              >
                {index + 1}. {item.title}
              </h3>
              <p class="text-[0.7rem] text-muted-foreground leading-snug">
                {item.content}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="w-full">
      {#key $currentIndex}
        <div
          class="w-full aspect-video sm:aspect-[21/9] animate-in fade-in zoom-in-95 duration-700"
        >
          {#if data[$currentIndex]?.image}
            <div
              class="size-full rounded-2xl border border-border/50 bg-white p-6 flex items-center justify-center overflow-hidden"
            >
              <img
                src={data[$currentIndex].image}
                alt={data[$currentIndex].title}
                class="max-h-full max-w-full object-contain select-none"
                draggable="false"
              />
            </div>
          {:else if data[$currentIndex]?.video}
            <video
              preload="auto"
              src={data[$currentIndex].video}
              class="size-full rounded-2xl border border-border/50 object-cover"
              autoplay
              loop
              muted
            ></video>
          {:else}
            <div
              class="size-full rounded-2xl border border-border/50 bg-muted/30 p-1 flex items-center justify-center"
            >
              <div
                class="w-12 h-12 rounded-full bg-primary/10 animate-pulse"
              ></div>
            </div>
          {/if}
        </div>
      {/key}
    </div>
  </div>
</div>

<style>
  .card_code {
    transition: all 0.3s ease;
  }
  .item-box {
    width: 3rem;
    height: 3rem;
  }
</style>
