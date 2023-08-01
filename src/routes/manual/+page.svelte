<script lang="ts">
	import { onMount } from "svelte";
	import { drawPdf } from "$lib/pdf/pdfDoc";
	import FileSaver from "file-saver";

	import { invoiceMeta, yourCompany } from "$lib/constants/strings";

	let pdfNotGenerated = true;
	let pdf = {} as HTMLIFrameElement;
	let pdfString = undefined as undefined | string;

	const saveFile = (
		pdf: string | undefined,
		meta: { invoiceNumber: string },
		company: { name: string },
	) => {
		if (typeof pdf !== "string") return;
		const filename = `invoice_${meta.invoiceNumber}_${company.name}`;
		FileSaver.saveAs(pdf, filename + ".pdf");
	};

	onMount(async () => {
		try {
			pdfString = await drawPdf();
			if (typeof pdfString === "string") {
				pdf.src = pdfString;
				pdfNotGenerated = false;
			}
		} catch (err) {
			console.log("something went wrong", err);
		}
	});
</script>

<div class="wrapper">
	<button on:click={() => saveFile(pdfString, invoiceMeta, yourCompany)}
		>Lagre PDF</button
	>
	<div class="preview" class:invisible={pdfNotGenerated}>
		<iframe title="pdf" bind:this={pdf} style="width: 100%; height: 100%;" />
	</div>
</div>

<style>
	.wrapper {
		text-align: center;
	}
	button {
		margin-bottom: 1rem;
	}
	.invisible {
		display: none;
	}
	.preview {
		height: 94vh;
		overflow: hidden;
	}
</style>
