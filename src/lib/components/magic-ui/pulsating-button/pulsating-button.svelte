<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";
	interface PulsatingButtonProps {
		children: Snippet;
		class?: string;
		pulseColor?: string;
		duration?: string;
	}
	let {
		class: className,
		children,
		pulseColor = "#808080",
		duration = "1.5s",
		...props
	}: PulsatingButtonProps = $props();
</script>
<button
	class={cn(
		"bg-primary text-primary-foreground relative inline-flex cursor-pointer items-center justify-center rounded-2xl px-6 py-3 text-center font-semibold",
		className
	)}
	style={`--pulse-color: ${pulseColor}; --duration: ${duration};`}
	{...props}
>
	<div class="relative z-10">
		{@render children()}
	</div>
	<div
		class="absolute inset-0 rounded-2xl animate-pulse-ring"
		style={`--pulse-color: ${pulseColor};`}
	></div>
</button>

<style>
	button {
		--pulse-color: #808080;
		--duration: 1.5s;
	}

	:global(.animate-pulse-ring) {
		animation: pulse var(--duration) ease-out infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 var(--pulse-color);
		}
		70% {
			box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
		}
	}
</style>
