<script lang="ts">
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";

  let { value, duration = 2000, suffix = "" } = $props();

  let displayValue = spring(0, {
    stiffness: 0.05,
    damping: 0.2,
  });

  let element: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          displayValue.set(value);
        } else {
          displayValue.set(0, { hard: true });
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  });
</script>

<span bind:this={element} class="tabular-nums">
  {Math.floor($displayValue)}{suffix}
</span>
