<script lang="ts">
  import { onMount } from 'svelte'
  import { drawPdf } from '$lib/pdfDoc2'
  let pdfNotGenerated = true
  let pdf = {} as HTMLIFrameElement

  onMount(async () => {
    try {
      pdf.src = await drawPdf()
      pdfNotGenerated = false
    } catch (err) {
      console.log('something went wrong', err)
    }
  })
</script>

<div class="preview" class:invisible={pdfNotGenerated}>
  <iframe
    title="pdf"
    bind:this={pdf}
    style="width: 100%; height: 100%;"
  />
</div>

<style>
  .invisible {
    display: none;
  }
  .preview {
    height: 100%;
    overflow: hidden;
  }
</style>
