<script lang="ts">
	import { fade } from "svelte/transition";
	export let visible: boolean;
</script>

{#if visible}
	<div class="spinner" aria-busy="true" transition:fade />
{/if}

<style>
	div {
		display: flex;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		justify-content: center;
		align-items: center;
		z-index: 1;
		border-radius: var(--border-radius);
		background: var(--card-background-color);
	}
</style>
