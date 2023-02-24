<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import HeaderNavLink from './HeaderNavLink.svelte';
	export let isAuthenticated: boolean;
	const logout = async () => {
		await fetch('/logout', { method: 'POST' });
		invalidateAll();
	};
</script>

<header>
	<h1>Invoice generator</h1>
	<nav>
		<HeaderNavLink to="/" title="Home" />
		<HeaderNavLink to="/companies" title="Companies" />
		<HeaderNavLink to="/invoices" title="Invoices" />
		{#if isAuthenticated}
			<HeaderNavLink on:click={logout} title="Logout" />
		{:else}
			<HeaderNavLink to="/login" title="Login" />
		{/if}
	</nav>
</header>

<style>
	header {
		text-transform: uppercase;
		justify-content: center;
		display: flex;
		flex-direction: column;
		color: var(--text-hl);
	}

	h1 {
		font-size: 1.2em;
		margin-block: unset;
	}
	nav {
		display: flex;
		flex-direction: row;
	}
</style>
