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
	<hr />
	<nav>
		<ul>
			<HeaderNavLink to="/" title="Home" />
			<HeaderNavLink to="/companies" title="Companies" />
			<HeaderNavLink to="/invoices" title="Invoices" />
			{#if isAuthenticated}
				<HeaderNavLink on:click={logout} title="Logout" />
			{:else}
				<HeaderNavLink to="/login" title="Login" />
			{/if}
		</ul>
	</nav>
</header>

<style>
	header {
		background: var(--card-background-color);
		padding: 1em 1em 0.25em;
		text-align: center;
		text-transform: uppercase;
	}

	h1 {
		font-size: 1.2em;
		margin-block: unset;
	}

	hr {
		width: 5em;
		margin: 1em auto -0.4em;
	}

	nav {
		justify-content: center;
	}
</style>
