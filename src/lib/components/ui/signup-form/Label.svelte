<script lang="ts">
  import { cn } from "$lib/utils";

  let { className = undefined, children, ...restProps } = $props();
</script>

<label
  class={cn(
    "text-sm font-medium leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white",
    className,
  )}
  {...restProps}
>
  {@render children()}
</label>
