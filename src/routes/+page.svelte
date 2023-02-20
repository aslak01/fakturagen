<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { drawPdf } from '$lib/pdf/pdfDoc';
	import FileSaver from 'file-saver';
	export let data: PageData;

	import { invoiceMeta, yourCompany } from '$lib/constants/strings';

	let pdfNotGenerated = true;
	let pdf = {} as HTMLIFrameElement;
	let pdfString = undefined as undefined | string;

	const saveFile = (
		pdf: string | undefined,
		meta: { invoiceNumber: string },
		company: { name: string }
	) => {
		if (typeof pdf !== 'string') return;
		const filename = `invoice_${meta.invoiceNumber}_${company.name}`;
		FileSaver.saveAs(pdf, filename + '.pdf');
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

Du er {data.isAuthenticated ? '' : 'ikke'} logget inn, {data.userName
	? data.userName
	: ''}.
{#if data.isAuthenticated}
	<a href="/logout">Klikk her for å logge ut</a>
{:else}
	<a href="/login">Klikk her for å logge inn</a>
{/if}

{#if typeof pdfString !== 'undefined'}
	<button on:click={() => saveFile(pdfString, invoiceMeta, yourCompany)}
		>Save</button
	>
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
