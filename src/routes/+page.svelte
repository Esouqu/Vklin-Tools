<script lang="ts">
	import Roulette from '$lib/components/Roulette.svelte';
	import type { IItem } from '$lib/data/itemsData';
	import ITEMS from '$lib/data/itemsData';
	import keyImage from '$lib/assets/images/key.jpg';
	import ItemNote from '$lib/components/ItemNote.svelte';
	import RARITIES from '$lib/data/raritiesData';
	import KEYS from '$lib/data/keysData';
	import Card from '$lib/components/Card.svelte';
	import { arrayFromRange, getNoun } from '$lib/utils';
	import ButtonSelect from '$lib/components/ButtonSelect.svelte';
	import DiceBox from '$lib/components/DiceBox.svelte';
	import itemDropSoundFile from '$lib/assets/sounds/public_sound_drop0.mp3';
	import keysDropSoundFile from '$lib/assets/sounds/public_sound_drop2.mp3';
	import DICES from '$lib/data/diceData';

	interface IKeysRange {
		name: string;
		image: string;
		value: number;
	}

	let selectedDiceIdx = $state(1);
	let selectedDice = $derived(DICES[selectedDiceIdx]);
	let selectedRarity = $state(0);
	let isRollingItems = $state(false);
	let isRollingKeys = $state(false);
	let transformedItems: IItem[] = $derived.by(mapItems);
	let transformedKeys: IKeysRange[] = $derived.by(transformKeys);
	let winnerItem: IItem | undefined = $state();
	let winnerKeys: IKeysRange | undefined = $state();
	let keysNoun: string | undefined = $derived.by(getKeysNoun);

	function getKeysNoun() {
		if (winnerKeys) {
			return getNoun(winnerKeys.value, ['Ключ', 'Ключа', 'Ключей']);
		}
	}

	function mapItems() {
		return ITEMS.filter((item) => item.rarity <= selectedRarity);
	}

	function transformKeys() {
		const currentRange = KEYS[selectedRarity];
		const { min, max } = currentRange;

		return arrayFromRange(min, max).map((i) => ({
			name: `x${i}`,
			image: keyImage,
			value: i
		}));
	}
</script>

<div class="main-page">
	<div class="middle">
		<div
			class="section-wrapper"
			style="flex-direction: row; align-items: center; justify-content: space-between;"
		>
			<h2 style="color: white;">Диапазон</h2>
			<ButtonSelect
				options={RARITIES}
				isDisabled={isRollingItems || isRollingKeys}
				bind:currentOption={selectedRarity}
			/>
		</div>
		<div class="section-wrapper" style="width: 100%;">
			<div style="display: flex; align-items: center; justify-content: space-between;">
				<h2 style="margin: 0; color: white;">Кубик</h2>
				<ButtonSelect options={DICES} bind:currentOption={selectedDiceIdx} />
			</div>
			<div style="display: flex; justify-content: center; width: 100%;">
				<DiceBox {...selectedDice} color={RARITIES[selectedRarity].color} />
			</div>
		</div>
		<div class="section-wrapper">
			<h2 style="margin: 0; color: white;">Предмет</h2>
			<Roulette
				items={transformedItems}
				dropSoundFile={itemDropSoundFile}
				onStart={() => {
					isRollingItems = true;
					winnerItem = undefined;
				}}
				onFinished={(item) => {
					isRollingItems = false;
					winnerItem = item;
				}}
			/>
		</div>
		<div class="section-wrapper">
			<h2 style="margin: 0; color: white;">Ключи</h2>
			<Roulette
				items={transformedKeys}
				dropSoundFile={keysDropSoundFile}
				onStart={() => {
					isRollingKeys = true;
					winnerKeys = undefined;
				}}
				onFinished={(item) => {
					isRollingKeys = false;
					winnerKeys = item;
				}}
			/>
		</div>
	</div>
	<div class="right">
		{#if winnerItem}
			<ItemNote {...winnerItem} />
		{/if}
		{#if winnerKeys}
			<Card>
				<div class="keys-card">
					<div class="keys-card-image" style="background-image: url({winnerKeys.image});"></div>
					<div style="display: flex; align-items: center;">
						<h2>
							{winnerKeys.name}
							{keysNoun}
						</h2>
					</div>
				</div>
			</Card>
		{/if}
	</div>
</div>

<style lang="scss">
	.keys-card {
		display: flex;
		gap: 20px;

		&-image {
			border-radius: 8px;
			min-width: 75px;
			width: 75px;
			height: 75px;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center;
			box-shadow: inset var(--elevation-3);
		}
	}
	.main-page {
		position: relative;
		display: grid;
		grid-template-columns: 0.5fr auto 0.5fr;
		gap: 20px;
		height: 100vh;
	}
	.middle {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		grid-column: 2;
	}
	.section-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;

		&:not(:last-child) {
			margin-bottom: 10px;
		}
	}
	.right {
		display: flex;
		flex-direction: column;
		align-items: end;
		grid-column: 3;
		padding: 20px;
	}
</style>
