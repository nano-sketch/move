<script lang="ts">
	import { cn } from "$lib/utils";
	
	type ElementType = "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	
	interface LineShadowTextProps {
		content: string;
		class?: string;
		shadowColor?: string;
		as?: ElementType;
	}
	
	let {
		content,
		class: className,
		shadowColor = "black",
		as = "span",
	}: LineShadowTextProps = $props();
</script>

<svelte:element
	this={as}
	style={`--shadow-color: ${shadowColor}`}
	class={cn(
		"relative z-0 inline-block whitespace-pre line-shadow-text",
		className
	)}
	data-text={content}
>
	{content}
</svelte:element>

<style>
	.line-shadow-text {
		--shadow-color: black;
		position: relative;
		display: inline-block;
		background: inherit;
		color: inherit;
	}

	.line-shadow-text::after {
		content: attr(data-text);
		position: absolute;
		top: 0.04em;
		left: 0.04em;
		z-index: -1;
		background: linear-gradient(
			45deg,
			transparent 45%,
			var(--shadow-color) 45%,
			var(--shadow-color) 55%,
			transparent 55%
		);
		background-size: 0.06em 0.06em;
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
		animation: line-shadow 15s linear infinite;
		white-space: pre;
	}
</style>
