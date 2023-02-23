<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../../app.css';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
</script>

<svelte:head>
	<title>Fakturagenerator</title>
	<link
		rel="stylesheet"
		href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
	/>
</svelte:head>

<Header isAuthenticated={data.isAuthenticated} />
<main class="container">
	<slot />
</main>

<style>
	main {
		flex: 1 0 auto;
		padding: 2em 1em;
	}
</style>
