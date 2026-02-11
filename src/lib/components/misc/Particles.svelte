<script lang="ts">
  import { onMount } from "svelte";

  export let className = "";
  export let quantity = 50;
  export let staticity = 50;
  export let ease = 50;
  export let size = 0.4;
  export const refresh = true;
  export let color = "#ffffff";
  export let vx = 0;
  export let vy = 0;

  let canvasRef: HTMLCanvasElement;
  let canvasContainerRef: HTMLDivElement;
  let context: CanvasRenderingContext2D | null = null;
  let circles: any[] = [];
  let mouse = { x: 0, y: 0 };
  let canvasSize = { w: 0, h: 0 };
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  function hexToRgb(hex: string) {
    hex = hex.replace("#", "");
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const int = parseInt(hex, 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  }

  const rgb = hexToRgb(color);

  function circleParams() {
    const x = Math.random() * canvasSize.w;
    const y = Math.random() * canvasSize.h;
    const translateX = 0,
      translateY = 0;
    const pSize = Math.random() * 2 + size;
    const alpha = 0;
    const targetAlpha = +(Math.random() * 0.6 + 0.1).toFixed(1);
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  }

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
  }

  function clearContext() {
    if (context) context.clearRect(0, 0, canvasSize.w, canvasSize.h);
  }

  function drawCircle(c: any, update = false) {
    if (!context) return;
    const { x, y, translateX, translateY, size, alpha } = c;
    context.translate(translateX, translateY);
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.fillStyle = `rgba(${rgb.join(",")},${alpha})`;
    context.fill();
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!update) circles.push(c);
  }

  function drawParticles() {
    clearContext();
    for (let i = 0; i < quantity; i++) drawCircle(circleParams());
  }

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

  let animationId: number,
    lastTime = 0;
  const targetFPS = 30,
    frameInterval = 1000 / targetFPS;

  function animate(t = 0) {
    if (t - lastTime < frameInterval)
      return (animationId = requestAnimationFrame(animate));
    lastTime = t;
    clearContext();
    circles.forEach((c, i) => {
      const edge = [
        c.x + c.translateX - c.size,
        canvasSize.w - c.x - c.translateX - c.size,
        c.y + c.translateY - c.size,
        canvasSize.h - c.y - c.translateY - c.size,
      ];
      const closest = Math.min(...edge);
      const mapped = +remapValue(closest, 0, 20, 0, 1).toFixed(2);
      if (mapped > 1) c.alpha = Math.min(c.alpha + 0.02, c.targetAlpha);
      else c.alpha = c.targetAlpha * mapped;
      c.x += c.dx + vx;
      c.y += c.dy + vy;
      c.translateX +=
        (mouse.x / (staticity / c.magnetism) - c.translateX) / ease;
      c.translateY +=
        (mouse.y / (staticity / c.magnetism) - c.translateY) / ease;
      drawCircle(c, true);
      if (
        c.x < -c.size ||
        c.x > canvasSize.w + c.size ||
        c.y < -c.size ||
        c.y > canvasSize.h + c.size
      ) {
        circles.splice(i, 1);
        drawCircle(circleParams());
      }
    });
    animationId = requestAnimationFrame(animate);
  }

  function onMouseMove(e: MouseEvent) {
    if (!canvasRef) return;
    const rect = canvasRef.getBoundingClientRect();
    const { w, h } = canvasSize;
    const x = e.clientX - rect.left - w / 2;
    const y = e.clientY - rect.top - h / 2;
    if (x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2) mouse = { x, y };
  }

  onMount(() => {
    if (canvasRef) {
      context = canvasRef.getContext("2d");
      resizeCanvas();
      animate();
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("mousemove", onMouseMove);
    }
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  });

  $: if (canvasRef) drawParticles();
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
