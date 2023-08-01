<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import AuthorizationAlert from "$lib/components/AuthorizationAlert.svelte";
	import DataTable from "$lib/components/DataTable.svelte";
	// import TextareaInput from '$lib/components/inputs/TextareaInput.svelte';
	import TextInput from "$lib/components/inputs/TextInput.svelte";
	import ModalEditor from "$lib/components/ModalEditor.svelte";
	import { savable } from "$lib/savable";
	import { trpc } from "$lib/trpc/client";
	import type { RouterInputs } from "$lib/trpc/router";
	import { TRPCClientError } from "@trpc/client";
	import type { PageData } from "./$types";

	export let data: PageData;

	let busy = false;
	let item: RouterInputs["companies"]["save"] | null = null;
	let errors: { message: string; path: string[] }[] | null = null;
	let needsAuthorization = false;

	const ioCheckAuth = () => {
		if (!data.isAuthenticated) {
			needsAuthorization = true;
			return;
		}
	};

	const handleAdd = async () => {
		ioCheckAuth();
		item = { id: null, name: "", currency: "", orgNo: "" };
	};

	const handleEdit = async (e: CustomEvent<string>) => {
		ioCheckAuth();
		busy = true;
		item = await trpc().companies.load.query(e.detail);
		busy = false;
	};

	const handleDelete = async (e: CustomEvent<string>) => {
		ioCheckAuth();
		busy = true;
		await trpc().companies.delete.mutate(e.detail);
		await invalidateAll();
		busy = false;
	};

	const handleCancel = () => {
		item = null;
		errors = null;
	};

	const handleSave = async (e: {
		detail: RouterInputs["companies"]["save"];
	}) => {
		ioCheckAuth();
		busy = true;
		try {
			await trpc().companies.save.mutate(savable(e.detail));
			item = null;
			await invalidateAll();
		} catch (err) {
			if (err instanceof TRPCClientError) {
				errors = JSON.parse(err.message);
			} else {
				throw err;
			}
		} finally {
			busy = false;
		}
	};
</script>

<svelte:head>
	<title>Companies</title>
</svelte:head>

<DataTable
	{busy}
	title="Companies"
	items={data.companies}
	columns={[
		{ title: "Name", grow: true, accessor: (company) => company.name },
		{
			title: "Organisation number",
			accessor: (company) => (company.orgNo ? company.orgNo : "ukjent"),
		},
		{
			title: "Invoices",
			align: "right",
			accessor: (company) => (company.invoices ? company.invoices.length : "0"),
		},
	]}
	on:add={handleAdd}
	on:edit={handleEdit}
	on:delete={handleDelete}
/>

<ModalEditor
	{item}
	itemName="company"
	on:cancel={handleCancel}
	on:save={handleSave}
>
	<div class="grid">
		<TextInput name="name" label="name" required {errors} {item} />
	</div>
	<TextInput name="orgNo" label="orgNo" required {errors} {item} />
</ModalEditor>

<AuthorizationAlert
	visible={needsAuthorization}
	on:close={() => (needsAuthorization = false)}
/>
