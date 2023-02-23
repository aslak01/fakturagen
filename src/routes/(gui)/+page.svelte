<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

Du er {data.isAuthenticated ? '' : 'ikke'} logget inn, {data.userName
	? data.userName
	: ''}.
{#if data.isAuthenticated === false}
	<a href="/login">Klikk her for å logge inn</a>
{/if}
