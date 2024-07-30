<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		children: Snippet;
		color?: string;
	}

	const { color, children }: Props = $props();
</script>

<div
	class="card"
	style="--card-accent-color: {color || 'var(--surface-container-highest)'};"
	transition:slide={{ axis: 'y', duration: 500 }}
>
	{@render children()}
</div>

<style lang="scss">
	.card {
		border-radius: 8px;
		width: 400px;
		max-width: 400px;
		padding: 20px;
		box-shadow: var(--elevation-3);
		background: radial-gradient(
			circle at 100% 0,
			var(--card-accent-color),
			var(--surface-container-high),
			var(--surface-container)
		);
		color: white;

		&:not(:last-child) {
			margin-bottom: 12px;
		}
	}
</style>
