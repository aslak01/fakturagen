<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import "../../app.css";
	import type { LayoutData } from "./$types";
	export let data: LayoutData;
</script>

<svelte:head>
	<title>Fakturagenerator</title>
	<!-- <link -->
	<!-- 	rel="stylesheet" -->
	<!-- 	href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css" -->
	<!-- /> -->
</svelte:head>

<main class="container">
	<Header isAuthenticated={data.isAuthenticated} />
	<slot />
</main>

<style>
	main {
		flex: 1 0 auto;
		padding: 1em;
	}
</style>
