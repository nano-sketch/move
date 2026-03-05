<script lang="ts">
  let { gradient = false, children } = $props();
</script>

<div
  class="relative w-full flex items-center justify-center pointer-events-none select-none"
>
  <div
    class="w-full h-[1px] {gradient
      ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent shadow-[0_0_8px_rgba(255,255,255,0.1)]'
      : 'bg-white/20'}"
  ></div>
  {#if children}
    <div class="absolute flex items-center justify-center">
      <div class="bg-card z-10 px-2 text-xs text-muted-foreground">
        {@render children()}
      </div>
    </div>
  {/if}
</div>
