<script lang="ts">
	export let required: boolean;
</script>

{#if required}
	<span>*</span>
{/if}

<style>
	span {
		opacity: 0.5;
		margin-left: 0.25em;
	}
</style>
