<script lang="ts">
  import HeaderNavLink from './HeaderNavLink.svelte'
</script>

<header>
  <h1>Invoice generator</h1>
  <hr />
  <nav>
    <ul>
      <HeaderNavLink to="/" title="Home" />
      <HeaderNavLink to="/companies" title="Companies" />
      <HeaderNavLink to="/invoices" title="Invoices" />
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
    font-size: 3em;
  }

  p {
    font-size: 0.75em;
    letter-spacing: 1.1em;
    text-indent: 0.9em;
  }

  hr {
    width: 5em;
    margin: 1em auto -0.4em;
  }

  nav {
    justify-content: center;
  }
</style>
