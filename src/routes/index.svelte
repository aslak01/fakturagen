<script lang="ts">
  import { onMount } from 'svelte'

  import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

  import {
    yourCompany,
    yourBank,
    invoiceMeta,
    customer,
    lineHeadings,
    author,
    service,
    title,
    lines,
    pdfTitle
  } from '$lib/constants/strings'

  import {
    drawTitle,
    drawKunde,
    drawFakturaLinjer,
    drawFakturaInfo,
    drawSums,
    drawPayTo
  } from '$lib/drawRoutines'
  import type { Font } from 'pdf-lib/cjs/types/fontkit'

  let pdf = {} as HTMLIFrameElement
  let pdfWasGenerated = false

  async function createPdf() {
    const pdfDoc = await PDFDocument.create()
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    )
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()

    const settings = {
      page,
      width,
      height,
      font: helvetica,
      boldFont: helveticaBold,
      rgb,
      color: rgb(0, 0, 0),
      titleSize: 15,
      lineSize: 10,
      xMargin: 100,
      yMargin: 100,
      marginTop: 80
    }

    pdfDoc.setTitle(pdfTitle)

    pdfDoc.setAuthor(author)
    pdfDoc.setSubject(service)
    pdfDoc.setCreationDate(new Date())
    pdfDoc.setModificationDate(new Date())

    drawTitle(title, settings)
    drawKunde(customer, settings)
    drawFakturaLinjer(lineHeadings, lines, settings)
    drawFakturaInfo(yourCompany, invoiceMeta, settings)

    const test = drawFakturaLinjer(lineHeadings, lines, settings)

    page.drawLine({
      start: { x: settings.xMargin, y: test.end },
      end: { x: settings.width - settings.xMargin, y: test.end },
      thickness: 1,
      color: settings.color
    })

    drawSums(lines, settings, test.end)

    drawPayTo(yourBank, settings, test.end)

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
    pdfWasGenerated = true
    pdf.src = pdfDataUri
  }

  onMount(() => {
    createPdf()
  })
</script>

<div class="preview" class:invisible={!pdfWasGenerated}>
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
