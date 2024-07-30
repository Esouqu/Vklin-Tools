<script lang="ts">
	import type { IItem } from '$lib/data/itemsData';
	import { fly } from 'svelte/transition';
	import Card from './Card.svelte';

	const { name, description, effect, hint, rarity, image }: Partial<IItem> = $props();
</script>

<Card>
	<div class="item-note" transition:fly={{ y: 100, duration: 500 }}>
		<div class="item-note-info">
			<div class="item-note-image" style="background-image: url({image});"></div>
			<div>
				<h2>{name}</h2>
				<p class="item-note-description">{description}</p>
			</div>
		</div>
		<p class="item-note-effect">{effect}</p>
		<!-- <p>{hint}</p> -->
	</div>
</Card>

<style lang="scss">
	.item-note {
		&-image {
			border-radius: 8px;
			min-width: 150px;
			width: 150px;
			height: 150px;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center;
			box-shadow: inset var(--elevation-3);
		}
		&-info {
			display: flex;
			gap: 20px;
		}

		&-description {
			font-size: 14px;
			font-style: italic;
			opacity: 0.7;
		}
		&-effect {
			margin-bottom: 0;
			padding: 20px;
			box-shadow: inset var(--elevation-1);
			background-color: var(--surface-container);

			&::before {
				content: 'Эффект: ';
			}
		}
	}
</style>
