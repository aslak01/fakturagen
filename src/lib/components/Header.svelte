<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import HeaderNavLink from "./HeaderNavLink.svelte";
	export let isAuthenticated: boolean;
	const logout = async () => {
		await fetch("/logout", { method: "POST" });
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
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: var(--text-hl);
		text-transform: uppercase;
	}

	h1 {
		margin-block: unset;
		font-size: 1.2em;
	}
	nav {
		display: flex;
		flex-direction: row;
	}
</style>
