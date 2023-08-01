<script lang="ts">
	import { onMount } from "svelte";
	import LabelAsterisk from "./LabelAsterisk.svelte";

	type UnknownItem = Record<string, unknown> | null;

	export let label: string;
	export let name: string;
	export let required = false;
	export let errors: { message: string; path: string[] }[] | null = null;
	export let item: UnknownItem;
	$: error = errors?.find((e) => e.path.includes(name));
	let value = "";

	const validateItem = (item: UnknownItem) => {
		if (typeof item !== "object" || Array.isArray(item) || item === null)
			return "";
		if (name in item === false) return "";
		const obj = item;
		const key = name;
		const string = obj[key];
		if (typeof string !== "string") return "";
		const date = string.split("T")[0];
		return date;
	};

	onMount(() => {
		value = validateItem(item);
	});
	$: console.log(value);
</script>

<label>
	{label}<LabelAsterisk {required} />
	<input
		type="date"
		{name}
		{required}
		aria-invalid={error ? "true" : undefined}
		{value}
	/>
	{#if error}
		<small>{error.message}</small>
	{/if}
</label>

<style>
	small {
		color: var(--form-element-invalid-active-border-color);
	}
</style>
