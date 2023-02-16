<script lang="ts">
	import { onMount } from 'svelte';
	import { drawPdf } from '$lib/pdf/pdfDoc';
	import FileSaver from 'file-saver';

	import { invoiceMeta, yourCompany } from '$lib/constants/strings';

	let pdfNotGenerated = true;
	let pdf = {} as HTMLIFrameElement;
	let pdfString = undefined as undefined | string;

	const saveFile = () => {
		const filename = `invoice_${invoiceMeta.invoiceNumber}_${yourCompany.name}`;
		if (typeof pdfString === 'string') {
			FileSaver.saveAs(pdfString, filename + '.pdf');
		}
	};

	onMount(async () => {
		try {
			pdfString = await drawPdf();
			if (typeof pdfString === 'string') {
				pdf.src = pdfString;
				pdfNotGenerated = false;
			}
		} catch (err) {
			console.log('something went wrong', err);
		}
	});
</script>

{#if typeof pdfString !== 'undefined'}
	<button on:click={() => saveFile()}>Save</button>
{/if}
<div class="preview" class:invisible={pdfNotGenerated}>
	<iframe title="pdf" bind:this={pdf} style="width: 100%; height: 100%;" />
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
