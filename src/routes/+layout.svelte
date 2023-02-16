<script lang="ts">
  import Header from '$lib/components/Header.svelte'
  import '../app.css'
</script>

<svelte:head>
  <title>Fakturagenerator</title>
  <link
    rel="stylesheet"
    href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
  />
  <style>
    html,
    body,
    body > div {
      height: 100%;
    }

    body > div {
      display: flex;
      flex-direction: column;
    }

    svg.icon {
      width: 24px;
      height: 24px;
      vertical-align: text-bottom;
    }
  </style>
</svelte:head>

<Header />
<main class="container">
  <slot />
</main>

<style>
  main {
    flex: 1 0 auto;
    padding: 2em 1em;
  }
</style>
