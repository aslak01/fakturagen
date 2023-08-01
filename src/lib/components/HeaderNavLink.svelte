<script lang="ts">
	import { page } from "$app/stores";
	import { createEventDispatcher } from "svelte";
	export let to: string | undefined = undefined;
	export let title: string;
	const dispatch = createEventDispatcher<{ click: never }>();
	const handleClick = (e: MouseEvent) => {
		if (!to) {
			e.preventDefault();
			dispatch("click");
		}
	};
</script>

<a
	class:active={$page.url.pathname === to}
	href={to || "#"}
	on:click={handleClick}>{title}</a
>

<style>
	a,
	a:visited {
		display: inline-block;
		padding-inline: 0.5ch;
		color: var(--text-hl);
	}

	/* a:first-child { */
	/* 	padding-left: 0; */
	/* } */
	/* a:last-child { */
	/* 	padding-right: 0; */
	/* } */

	a:not(:first-child) {
		margin-left: 1rem;
	}
	a:hover {
		background: var(--text-hl);
		color: var(--surface);
	}

	a:active {
		background: darkred;
	}
</style>
