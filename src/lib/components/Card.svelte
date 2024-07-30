<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly, slide } from 'svelte/transition';

	const { children }: { children: Snippet } = $props();
</script>

<div class="card" transition:slide={{ axis: 'y', duration: 500 }}>
	{@render children()}
</div>

<style lang="scss">
	.card {
		border-radius: 8px;
		width: 400px;
		max-width: 400px;
		padding: 20px;
		box-shadow: var(--elevation-3);
		background-color: var(--surface-container-high);
		color: white;

		&:not(:last-child) {
			margin-bottom: 12px;
		}
	}
</style>
