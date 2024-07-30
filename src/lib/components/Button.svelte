<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ButtonProps {
		type?: 'button' | 'submit' | 'reset' | null;
		color?: string;
		isDisabled?: boolean;
		isSelected?: boolean;
		isRound?: boolean;
		onclick?: ((e: MouseEvent) => void) | null;
		onkeydown?: ((e: KeyboardEvent) => void) | null;
		children: Snippet;
	}

	const {
		type,
		color = 'buttonface',
		isDisabled = false,
		isSelected = false,
		isRound = false,
		onclick,
		onkeydown,
		children
	}: ButtonProps = $props();
</script>

<div class="button" class:disabled={isDisabled} class:selected={isSelected}>
	<button {type} class:round={isRound} style="--button-color: {color};" {onclick} {onkeydown}>
		{#if children}
			{@render children()}
		{:else}
			Button
		{/if}
	</button>
</div>

<style lang="scss">
	.button {
		position: relative;

		&:hover {
			& button {
				background-color: var(--hover-white);
			}
		}

		&:active {
			& button {
				scale: 0.95;
				box-shadow: unset;
			}
		}

		&.disabled {
			opacity: 0.3;
			pointer-events: none;
		}
		&.selected button {
			box-shadow: var(--elevation-1);
			color: black;
			background-color: var(--button-color, buttonface);
		}

		button {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 10px 20px;
			border: none;
			border-radius: 8px;
			width: 100%;
			height: var(--button-height, auto);
			opacity: 1;
			line-height: 1;
			font-weight: 500;
			text-transform: uppercase;
			color: white;
			background-color: transparent;
			transition: 0.2s;
			user-select: none;
			cursor: pointer;

			&.round {
				border-radius: 100%;
			}
		}
	}
</style>
