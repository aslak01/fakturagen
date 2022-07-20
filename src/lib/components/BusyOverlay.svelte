<script lang="ts">
  export let enabled: boolean;
</script>

<div aria-busy={enabled} />

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  div[aria-busy='true'] {
      background: rgba(black, 0.5);
      pointer-events: initial;
  }
</style>
