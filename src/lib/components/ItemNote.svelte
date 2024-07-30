<script lang="ts">
	import type { IItem } from '$lib/data/itemsData';
	import RARITIES from '$lib/data/raritiesData';
	import Card from './Card.svelte';

	const { name, description, effect, rarity, image }: Partial<IItem> = $props();
</script>

<Card color={rarity !== undefined ? RARITIES[rarity].color : undefined}>
	<div class="item-note">
		<div class="item-note-info">
			<div>
				<h2 style="margin: 0;">{name}</h2>
				<p class="item-note-description">{description}</p>
			</div>
			<div class="item-note-image rarity-{rarity}" style="background-image: url({image});"></div>
		</div>
		<p class="item-note-effect">{effect}</p>
	</div>
</Card>

<style lang="scss">
	.item-note {
		&-image {
			border-radius: 8px;
			min-width: 100px;
			width: auto;
			height: fit-content;
			aspect-ratio: 1 / 1;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center;
			box-shadow: inset 0px 0px 4px 1px var(--surface-container-low);
		}

		&-info {
			display: flex;
			gap: 20px;
			margin-bottom: 12px;
		}

		&-description {
			border-radius: 8px;
			font-style: italic;
			opacity: 0.7;
		}
		&-effect {
			margin: 0;
			padding: 20px;
			border-radius: 8px;
			background-color: var(--surface-container);

			&::before {
				content: 'Эффект: ';
			}
		}
	}
</style>
