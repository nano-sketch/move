<script lang="ts">
  let {
    src,
    className = "",
    autoPlay = true,
    muted = true,
    loop = true,
    preload = "auto" as "auto" | "metadata" | "none",
    fontSize = 12,
    fontWeight = "900",
    textAnchor = "middle",
    dominantBaseline = "middle",
    fontFamily = "inherit",
    as = "div",
    content = "",
  } = $props();

  // convert children to plain string if array
  let dynamic_content = $derived(
    Array.isArray(content) ? content.join("") : content,
  );

  let responsiveFontSize = $derived(
    typeof fontSize === "number" ? `${fontSize}vw` : fontSize,
  );

  let svgMask =
    $derived(`<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
      <text x='50%' y='50%' font-size='${responsiveFontSize}' font-weight='${fontWeight}'
        text-anchor='${textAnchor}' dominant-baseline='${dominantBaseline}' font-family='${fontFamily}'>
        ${dynamic_content}
      </text>
    </svg>`);

  let dataUrlMask = $derived(
    `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`,
  );
</script>

<svelte:element this={as} class={`relative w-full h-full ${className}`}>
  <div
    class="absolute inset-0 flex items-center justify-center overflow-hidden z-10"
    style="
      mask-image: {dataUrlMask};
      -webkit-mask-image: {dataUrlMask};
      mask-size: contain;
      -webkit-mask-size: contain;
      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
      mask-position: center;
      -webkit-mask-position: center;
    "
  >
    <div class="absolute inset-0 size-full bg-foreground z-0"></div>
    <video
      class="w-full h-full object-cover relative z-10"
      autoplay={autoPlay}
      {muted}
      {loop}
      {preload}
      playsinline
    >
      <source {src} />
      Your browser does not support the video tag.
    </video>
  </div>

  <span class="sr-only">{dynamic_content}</span>
</svelte:element>
