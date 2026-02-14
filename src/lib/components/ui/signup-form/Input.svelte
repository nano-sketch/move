<script lang="ts">
  import { cn } from "$lib/utils";
  import { useMotionTemplate, useMotionValue, Motion } from "svelte-motion";

  let {
    class: className = undefined,
    type = "text",
    value = $bindable(),
    ...restProps
  } = $props();

  let visible = $state(false);
  let isDark = $state(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = $derived(
    visible
      ? useMotionTemplate`
  radial-gradient(
    100px circle at ${mouseX}px ${mouseY}px,
    var(--blue-500),
    transparent 80%
  )
`
      : useMotionTemplate`
  radial-gradient(
    0px circle at ${mouseX}px ${mouseY}px,
    var(--blue-500),
    transparent 80%
  )
`,
  );

  $effect(() => {
    const checkTheme = () => {
      isDark = document.documentElement.classList.contains("default");
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  });
</script>

<Motion
  let:motion
  style={{
    background,
  }}
>
  <div
    use:motion
    role="presentation"
    onmousemove={handleMouseMove}
    onmouseenter={() => (visible = true)}
    onmouseleave={() => (visible = false)}
    class="group/input rounded-lg p-[2px] transition duration-300"
  >
    <input
      {type}
      bind:value
      class={cn(
        "duration-400 flex h-10 w-full rounded-md border-none px-3 py-2 text-sm transition file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:shadow-none",
        className,
      )}
      style={isDark
        ? "background: rgb(39 39 42); color: white; box-shadow: 0px 0px 1px 1px rgb(64 64 64);"
        : "background: white; color: black; box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.1);"}
      {...restProps}
    />
  </div>
</Motion>
