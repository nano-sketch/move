<script lang="ts">
  import { cn } from "$lib/utils";

  let { class: className = undefined, children, ...restProps } = $props();
</script>

<label
  class={cn(
    "label-field text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    className,
  )}
  {...restProps}
>
  {@render children()}
</label>

<style>
  .label-field {
    color: black;
  }

  :global(.default) .label-field {
    color: white;
  }
</style>
