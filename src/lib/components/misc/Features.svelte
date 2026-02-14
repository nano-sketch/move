<script lang="ts">
  import { onMount, type Component } from "svelte";

  interface FeatureItem {
    id: number;
    title: string;
    content: string;
    image?: string;
    video?: string;
    icon?: any;
  }

  let {
    collapseDelay = 5000,
    linePosition = "left",
    data = [] as FeatureItem[],
  } = $props();

  // local state for active feature tracking
  let currentIndex = $state(0);

  onMount(() => {
    // initialization delay for smooth entry
    const initialDelay = setTimeout(() => {
      currentIndex = 0;
    }, 100);

    // auto-rotation logic for features
    const autoScrollTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % data.length;
    }, collapseDelay);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(autoScrollTimer);
    };
  });
</script>

<div id="features" class="w-full">
  <div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
    <div class="w-full lg:w-[45%]">
      <div class="space-y-6">
        {#each data as item, index}
          <button
            class="relative flex items-center group/item cursor-pointer w-full text-left py-1"
            onclick={() => (currentIndex = index)}
            aria-label={`View feature: ${item.title}`}
          >
            {#if linePosition === "left" || linePosition === "right"}
              <div
                class="absolute inset-y-0 h-full w-0.5 overflow-hidden rounded-lg bg-foreground/10 {linePosition ===
                'right'
                  ? 'left-auto right-0'
                  : 'left-0 right-auto'}"
              >
                <div
                  class="absolute left-0 top-0 w-full {currentIndex === index
                    ? 'h-full'
                    : 'h-0'} origin-top bg-foreground transition-all ease-linear"
                  style="transition-duration: {currentIndex === index
                    ? `${collapseDelay}ms`
                    : '0s'};"
                ></div>
              </div>
            {/if}

            <div
              class="item-box mx-2 sm:mx-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-all duration-500"
            >
              {#if item.icon}
                <item.icon class="size-5 text-primary" />
              {/if}
            </div>

            <div class="flex-1 space-y-0.5 min-w-0">
              <h3
                class="text-base lg:text-xl font-bold tracking-tight text-foreground transition-colors"
              >
                {index + 1}. {item.title}
              </h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                {item.content}
              </p>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <div class="w-full lg:w-[55%]">
      <div
        class="w-full aspect-video lg:aspect-auto lg:h-[450px] p-1 rounded-xl border border-border/50 bg-card/20 relative overflow-hidden shadow-lg"
      >
        {#key currentIndex}
          <div class="size-full animate-in fade-in duration-500">
            {#if data[currentIndex]?.image}
              <img
                src={data[currentIndex].image}
                alt={data[currentIndex].title}
                class="size-full rounded-lg object-cover object-left-top select-none"
                draggable="false"
                loading="lazy"
              />
            {:else if data[currentIndex]?.video}
              <video
                preload="auto"
                src={data[currentIndex].video}
                class="size-full rounded-lg object-cover"
                autoplay
                loop
                muted
                playsinline
              ></video>
            {:else}
              <div
                class="size-full rounded-lg bg-muted/30 flex items-center justify-center"
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
</div>

<style>
  .item-box {
    width: 3rem;
    height: 3rem;
  }
</style>
