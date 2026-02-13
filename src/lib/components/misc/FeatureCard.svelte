<script lang="ts">
  let { title, description, icon: IconComponent } = $props();

  let mouseX = $state(0);
  let mouseY = $state(0);
  let opacity = $state(0);

  function handleMouseMove(e: MouseEvent) {
    const { left, top } = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect();
    mouseX = e.clientX - left;
    mouseY = e.clientY - top;
    opacity = 1;
  }

  function handleMouseLeave() {
    opacity = 0;
  }
</script>

<div
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
  role="presentation"
  class="group relative h-full w-full overflow-hidden rounded-3xl bg-card border border-border/50 transition-all duration-300 hover:border-primary/30"
>
  <!-- revealed pointer layer (native implementation) -->
  <div
    class="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
    style="
      opacity: {opacity};
      background: radial-gradient(300px circle at {mouseX}px {mouseY}px, rgba(255, 255, 255, 0.1), transparent 80%);
    "
  ></div>

  <!-- subtle top accent line -->
  <div
    class="absolute right-10 top-0 h-px w-2/3 bg-gradient-to-l from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
  ></div>

  <!-- content layer -->
  <div class="relative flex h-full flex-col gap-6 p-8">
    <div
      class="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300"
    >
      <IconComponent class="size-6" />
    </div>

    <div class="space-y-3">
      <h3 class="text-xl font-bold tracking-tight text-card-foreground">
        {title}
      </h3>
      <p class="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  </div>
</div>
