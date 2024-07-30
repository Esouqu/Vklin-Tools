<script lang="ts">
	type T = $$Generic<MaybeButtonSelectItem>;

	interface MaybeButtonSelectItem {
		name: string;
		color?: string;
	}

	interface Props {
		options: T[];
		currentOption: number;
		onOptionChange?: ((optionValue: number) => void) | null;
	}

	let { options = [], currentOption = $bindable(0), onOptionChange }: Props = $props();

	function setOption(optionValue: number) {
		currentOption = optionValue;

		if (onOptionChange) onOptionChange(optionValue);
	}
</script>

<div class="button-select">
	{#each options as option, idx}
		<button
			type="button"
			class:selected={idx === currentOption}
			style="--button-color: {option.color || 'buttonface'};"
			onclick={() => setOption(idx)}>{option.name}</button
		>
	{/each}
</div>

<style lang="scss">
	.button-select {
		display: flex;
		align-items: center;
		border-radius: 8px;
		padding: 5px;
		color: white;
		// background-color: var(--surface-container);

		button {
			position: relative;
			border: none;
			padding: 8px 16px;
			width: 100%;
			line-height: 1;
			font-weight: 500;
			text-transform: uppercase;
			background-color: transparent;
			color: var(--on-surface);
			opacity: 0.5;
			transition: 0.2s;
			cursor: pointer;

			&.selected {
				opacity: 1;
				color: black;
				background-color: var(--button-color);
				pointer-events: none;
			}

			// &:not(:last-child)::after {
			// 	content: '';
			// 	position: absolute;
			// 	right: -1px;
			// 	width: 1px;
			// 	height: 100%;
			// 	background-color: var(--neutral);
			// }

			&:last-child {
				border-radius: 0 8px 8px 0;
			}

			&:first-child {
				border-radius: 8px 0 0 8px;
			}

			&:hover {
				opacity: 1;
			}
		}
	}
</style>
