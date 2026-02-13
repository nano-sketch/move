<script lang="ts">
  import { onMount, untrack } from "svelte";

  let {
    className = "",
    quantity = 50,
    staticity = 50,
    ease = 50,
    size = 0.4,
    color = "#ffffff",
    vx = 0,
    vy = 0,
  } = $props();

  let canvasRef = $state<HTMLCanvasElement | null>(null);
  let canvasContainerRef = $state<HTMLDivElement | null>(null);
  let context: CanvasRenderingContext2D | null = null;
  let circles: any[] = [];
  let mouse = { x: 0, y: 0 };
  let canvasSize = { w: 0, h: 0 };
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  /**
   * utility to convert hex color codes to rgb arrays
   */
  function hexToRgb(hex: string) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const int = parseInt(hex, 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  }

  const rgb = $derived(hexToRgb(color));

  /**
   * generates initial parameters for a single particle circle
   */
  function createCircleParams() {
    const x = Math.random() * canvasSize.w;
    const y = Math.random() * canvasSize.h;
    const pSize = Math.random() * 2 + size;
    const targetAlpha = +(Math.random() * 0.6 + 0.1).toFixed(1);
    const magnetism = 0.1 + Math.random() * 4;

    return {
      x,
      y,
      translateX: 0,
      translateY: 0,
      size: pSize,
      alpha: 0,
      targetAlpha,
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism,
    };
  }

  /**
   * synchronizes canvas dimensions with its parent container
   */
  function resizeCanvas() {
    if (!canvasContainerRef || !canvasRef || !context) return;
    circles = [];
    canvasSize = {
      w: canvasContainerRef.offsetWidth,
      h: canvasContainerRef.offsetHeight,
    };
    canvasRef.width = canvasSize.w * dpr;
    canvasRef.height = canvasSize.h * dpr;
    canvasRef.style.width = `${canvasSize.w}px`;
    canvasRef.style.height = `${canvasSize.h}px`;
    context.scale(dpr, dpr);

    // initial particle burst
    for (let i = 0; i < quantity; i++) {
      circles.push(createCircleParams());
    }
  }

  /**
   * draws a single particle on the canvas context
   */
  function renderCircle(c: any) {
    if (!context) return;
    const { x, y, translateX, translateY, size, alpha } = c;
    context.translate(translateX, translateY);
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.fillStyle = `rgba(${rgb.join(",")},${alpha})`;
    context.fill();
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * simple linear mapping utility for edge fading
   */
  function remapValue(
    v: number,
    s1: number,
    e1: number,
    s2: number,
    e2: number,
  ) {
    const r = ((v - s1) * (e2 - s2)) / (e1 - s1) + s2;
    return r > 0 ? r : 0;
  }

  let animationId: number;
  let lastTime = 0;
  const targetFPS = 60; // boosted for premium feel
  const frameInterval = 1000 / targetFPS;

  /**
   * main animation loop using requestanimationframe
   */
  function animate(t = 0) {
    if (t - lastTime < frameInterval) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    lastTime = t;

    if (context) {
      context.clearRect(0, 0, canvasSize.w, canvasSize.h);
    }

    circles.forEach((c, i) => {
      // transparency mapping based on container edges
      const edge = [
        c.x + c.translateX - c.size,
        canvasSize.w - c.x - c.translateX - c.size,
        c.y + c.translateY - c.size,
        canvasSize.h - c.y - c.translateY - c.size,
      ];

      const closest = Math.min(...edge);
      const mapped = +remapValue(closest, 0, 20, 0, 1).toFixed(2);

      if (mapped > 1) {
        c.alpha = Math.min(c.alpha + 0.02, c.targetAlpha);
      } else {
        c.alpha = c.targetAlpha * mapped;
      }

      c.x += c.dx + vx;
      c.y += c.dy + vy;
      c.translateX +=
        (mouse.x / (staticity / c.magnetism) - c.translateX) / ease;
      c.translateY +=
        (mouse.y / (staticity / c.magnetism) - c.translateY) / ease;

      renderCircle(c);

      // recycling particles that move out of bounds
      if (
        c.x < -c.size ||
        c.x > canvasSize.w + c.size ||
        c.y < -c.size ||
        c.y > canvasSize.h + c.size
      ) {
        circles[i] = createCircleParams();
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  /**
   * captures mouse movement relative to canvas center
   */
  function handleMouseMove(e: MouseEvent) {
    if (!canvasRef) return;
    const rect = canvasRef.getBoundingClientRect();
    const { w, h } = canvasSize;
    const x = e.clientX - rect.left - w / 2;
    const y = e.clientY - rect.top - h / 2;

    if (Math.abs(x) < w / 2 && Math.abs(y) < h / 2) {
      mouse = { x, y };
    }
  }

  onMount(() => {
    if (canvasRef) {
      context = canvasRef.getContext("2d");
      resizeCanvas();
      animate();
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  });

  // reactive redraw on quantity/refresh changes
  $effect(() => {
    quantity;
    untrack(() => {
      if (canvasRef) resizeCanvas();
    });
  });
</script>

<div class={className} bind:this={canvasContainerRef} aria-hidden="true">
  <canvas bind:this={canvasRef} class="size-full"></canvas>
</div>

<style>
  .size-full {
    width: 100%;
    height: 100%;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>
