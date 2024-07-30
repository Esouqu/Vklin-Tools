<script lang="ts">
	import type { IRarity } from '$lib/data/raritiesData';
	import Button from './Button.svelte';

	interface Props {
		rarities: IRarity[];
		currentRarity: number;
	}

	let { rarities, currentRarity = $bindable() }: Props = $props();

	function setRarity(rarity: number) {
		currentRarity = rarity;
	}
</script>

<div class="rarity-selector">
	<h2 style="color: white;">Диапазон</h2>
	<div style="display: flex; justify-content: center;">
		{#each rarities as rarity}
			<Button
				color={rarity.color}
				isSelected={rarity.value === rarities[currentRarity].value}
				onclick={() => setRarity(rarity.value)}
			>
				{rarity.name}
			</Button>
		{/each}
	</div>
</div>

<style lang="scss">
	.rarity-selector {
		margin-bottom: 40px;
		width: 100%;
	}
</style>
