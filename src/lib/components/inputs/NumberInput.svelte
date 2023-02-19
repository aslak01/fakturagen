<script lang="ts">
	import LabelAsterisk from './LabelAsterisk.svelte';

	export let label: string;
	export let required = false;
	export let value: number;
	export let error: string | void;
</script>

<label>
	{label}<LabelAsterisk {required} />
	<input
		type="number"
		{required}
		aria-invalid={error ? 'true' : undefined}
		bind:value
	/>
	{#if error}
		<small>{error}</small>
	{/if}
</label>

<style>
	small {
		color: var(--form-element-invalid-active-border-color);
	}
</style>
