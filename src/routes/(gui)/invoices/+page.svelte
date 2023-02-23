<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import AuthorizationAlert from '$lib/components/AuthorizationAlert.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	// import CheckboxList from '$lib/components/inputs/CheckboxList.svelte';
	import Select from '$lib/components/inputs/Select.svelte';
	// import TextareaInput from '$lib/components/inputs/TextareaInput.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';
	import ModalEditor from '$lib/components/ModalEditor.svelte';
	import { savable } from '$lib/savable';
	import { trpc } from '$lib/trpc/client';
	import type { RouterInputs, RouterOutputs } from '$lib/trpc/router';
	import { TRPCClientError } from '@trpc/client';
	import type { PageData } from './$types';
	import dayjs from '$lib/dayjs';

	import { aMonthInTheFuture } from '$lib/utils';

	export let data: PageData;

	let busy = false;
	let item: RouterInputs['invoices']['save'] | null = null;
	let companies: RouterOutputs['companies']['loadOptions'] = [];
	let errors: { message: string; path: string[] }[] | null = null;
	let needsAuthorization = false;

	const handleAdd = async () => {
		if (!data.isAuthenticated) {
			needsAuthorization = true;
			return;
		}

		companies = await trpc().companies.loadOptions.query();

		item = {
			id: '',
			number: 0,
			date: new Date(),
			dueDate: new Date(aMonthInTheFuture()),
			companyId: '',
			paid: false,
			sum: 0
		};
	};

	const handleEdit = async (e: CustomEvent<string>) => {
		if (!data.isAuthenticated) {
			needsAuthorization = true;
			return;
		}

		busy = true;
		[item, companies] = await Promise.all([
			trpc().invoices.load.query(e.detail),
			trpc().companies.loadOptions.query()
		]);
		console.log(item, companies);
		busy = false;
	};

	const handleDelete = async (e: CustomEvent<string>) => {
		if (!data.isAuthenticated) {
			needsAuthorization = true;
			return;
		}

		busy = true;
		// await trpc().invoices.delete.mutate(e.detail);
		console.log('would delete', e.detail);
		await invalidateAll();
		busy = false;
	};

	const handleCancel = () => {
		item = null;
		errors = null;
	};

	const handleSave = async (e: {
		detail: RouterInputs['invoices']['save'];
	}) => {
		if (!data.isAuthenticated) {
			needsAuthorization = true;
			return;
		}

		busy = true;
		try {
			await trpc().invoices.save.mutate(savable(e.detail));
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
	<title>invoices • invoicestall</title>
</svelte:head>

<DataTable
	{busy}
	title="invoices"
	items={data.invoices}
	columns={[
		{ title: 'Title', grow: true, accessor: 'number' },
		{
			title: 'Due',
			grow: true,
			align: 'right',
			accessor: ({ dueDate }) => dayjs(new Date(dueDate)).format('DD/MM/YYYY')
		},
		{
			title: 'Author',
			nowrap: true,
			accessor: ({ company: { name } }) => name
		}
	]}
	on:add={handleAdd}
	on:edit={handleEdit}
	on:delete={handleDelete}
/>

<ModalEditor
	{item}
	itemName="invoice"
	on:cancel={handleCancel}
	on:save={handleSave}
>
	<TextInput name="title" label="Title" required {errors} {item} />
	<div class="grid">
		<Select
			name="companyId"
			label="company"
			required
			{errors}
			{item}
			options={companies}
		/>
		<TextInput name="price" label="Price" price required {errors} {item} />
	</div>
	<!-- <CheckboxList -->
	<!-- 	name="storeIds" -->
	<!-- 	label="Store availability" -->
	<!-- 	{item} -->
	<!-- 	options={stores} -->
	<!-- /> -->
</ModalEditor>

<AuthorizationAlert
	visible={needsAuthorization}
	on:close={() => (needsAuthorization = false)}
/>
