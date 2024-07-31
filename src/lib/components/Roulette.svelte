<script lang="ts">
	import anime from 'animejs';
	import openSoundFile from '$lib/assets/sounds/public_sound_open.mp3';
	import rollSoundFile from '$lib/assets/sounds/public_sound_roll.mp3';
	import { onMount } from 'svelte';
	import { loadAudio, playSound, randomFromArray, randomWithinRange } from '$lib/utils';
	import Button from './Button.svelte';
	import { dev } from '$app/environment';
	import { fade } from 'svelte/transition';

	type T = $$Generic<RouletteItem>;

	interface RouletteItem {
		image: string;
		name: string;
		startPosition?: number;
	}

	interface Props {
		items: T[];
		dropSoundFile: string;
		onStart?: () => void;
		onFinished?: (winnerItem: T) => void;
	}

	const { items, dropSoundFile, onStart, onFinished }: Props = $props();

	const itemWidth = 125;
	const itemsGap = 20;
	const startOffset = -20;
	const animationDuration = dev ? 3000 : 15000;
	const totalDummyItems = 40;
	const itemsInView = 5;

	let openSound: HTMLAudioElement;
	let rollSound: HTMLAudioElement;
	let dropSound: HTMLAudioElement;

	let winnerItem: T | undefined = $state();
	let dummyItems: RouletteItem[] = $state(getRouletteItems());
	let isAnimating = $state(false);

	let itemElements: HTMLDivElement[] = $state([]);
	let containerElement: HTMLDivElement | undefined = $state();
	let pointerElement: HTMLDivElement | undefined = $state();
	let lastCollidedElement: HTMLDivElement | undefined = $state();

	onMount(async () => {
		openSound = loadAudio(openSoundFile);
		rollSound = loadAudio(rollSoundFile);
		dropSound = loadAudio(dropSoundFile);

		animateDummyItemsUpdate();
	});

	$effect(() => {
		if (items) {
			dummyItems = getRouletteItems();
			animateDummyItemsUpdate();
		}
	});

	function animateDummyItemsUpdate() {
		if (!containerElement) return;

		anime({
			targets: containerElement,
			translateX: [-1400, -startOffset],
			duration: 700,
			easing: 'cubicBezier(0, 0.84, 0.58, 1)'
		});
	}

	function roll() {
		const randomWinner = randomFromArray(items);
		dummyItems = generateItems(totalDummyItems, randomWinner);
		winnerItem = undefined;

		const spreadOffset = 6;
		const endPositionSpread = randomWithinRange(itemWidth / 2 - spreadOffset);
		const endPosition =
			startOffset + (dummyItems.length - itemsInView) * (itemWidth + itemsGap) + endPositionSpread;

		playSound(openSound);
		onStart?.();
		isAnimating = true;

		if (!containerElement) return;

		anime({
			targets: containerElement,
			translateX: [-startOffset, -endPosition],
			duration: animationDuration,
			easing: 'cubicBezier(0, 0.84, 0.58, 1)',
			update: () => {
				if (isUniqueItemCollides()) {
					playSound(rollSound);
				}
			}
		}).finished.then(() => {
			winnerItem = randomWinner;
			isAnimating = false;
			playSound(dropSound);
			onFinished?.(winnerItem);
		});
	}

	function isUniqueItemCollides() {
		if (!pointerElement) return;

		const pointerRect = pointerElement.getBoundingClientRect();

		for (const item of itemElements) {
			const itemRect = item.getBoundingClientRect();

			if (
				pointerRect.x < itemRect.x + itemRect.width &&
				pointerRect.x + pointerRect.width > itemRect.x
			) {
				if (lastCollidedElement === item) return false;

				lastCollidedElement = item;
				return true;
			}
		}

		return false;
	}

	function getRouletteItems() {
		return generateItems(totalDummyItems, randomFromArray(items));
	}

	function generateItems(amount: number, generatedWinner?: T) {
		const takenItems: RouletteItem[] = [];

		for (let i = 0; i < amount; i++) {
			const randomItem = randomFromArray(items);
			const winnerIdx = amount - 3;
			const currentItem = i === winnerIdx && generatedWinner ? generatedWinner : randomItem;
			const startPosition = i * (itemWidth + itemsGap);

			takenItems.push({ ...currentItem, startPosition });
		}

		return takenItems;
	}
</script>

<div
	class="roulette"
	style="--items-offset: {-startOffset}px; --item-size: {itemWidth}px; --item-gap: {itemsGap}px;"
>
	<div class="roulette-container">
		<div class="roulette-pointer" bind:this={pointerElement}></div>
		<div class="roulette-items" bind:this={containerElement}>
			{#each dummyItems as item, idx}
				<div
					class="roulette-item"
					style="background-image: url({item.image});"
					bind:this={itemElements[idx]}
				>
					<span> {item.name} </span>
				</div>
			{/each}
		</div>
		{#if !isAnimating}
			<div class="roulette-start-button" transition:fade={{ duration: 200 }}>
				<Button isDisabled={isAnimating} onclick={roll}>Начать</Button>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.roulette {
		position: relative;

		&-pointer {
			position: absolute;
			top: 0;
			left: 50%;
			translate: -50% 0;
			z-index: 1;
			height: var(--item-size);
			border-right: 1px solid #aa3;
			border-left: 1px solid #aa3;
			box-shadow: 0px 0px 1px 0px black;
		}

		&-container {
			position: relative;
			display: flex;
			flex-direction: column;
			gap: 20px;
			margin: 20px 0;
			border-radius: 8px;
			width: 750px;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				z-index: 3;
				width: 100%;
				height: 100%;
				background: radial-gradient(
					farthest-side circle,
					transparent 10%,
					transparent 50%,
					#0a0a0a 100%
				);
				pointer-events: none;
			}
		}

		&-items {
			display: flex;
			gap: var(--item-gap);
			transform: translateX(var(--items-offset));
		}

		&-item {
			position: relative;
			border-radius: 8px;
			min-width: var(--item-size);
			height: var(--item-size);
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center;
			box-shadow: var(--elevation-3);

			& span {
				position: absolute;
				bottom: 10px;
				left: 0;
				right: 0;
				padding: 6px 10px;
				font-size: 18px;
				font-weight: 500;
				text-align: center;
				text-shadow: 2px 2px 4px black;
				text-overflow: ellipsis;
				color: white;
				background-color: rgba(0 0 0 / 0.7);
				overflow: hidden;
			}
		}

		&-start-button {
			position: absolute;
			z-index: 2;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			background-color: rgba(0 0 0 / 0.7);
			align-items: center;
		}
	}
</style>
