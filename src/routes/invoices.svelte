<script context="module" lang="ts">
  import getEditorErrors from '$lib/client/getEditorErrors'
  import type {
    InferMutationInput,
    InferQueryOutput
  } from '$lib/client/trpc'
  import trpc from '$lib/client/trpc'
  import DataTable from '$lib/components/DataTable.svelte'
  import Select from '$lib/components/inputs/Select.svelte'
  // import TextInput from '$lib/components/inputs/TextInput.svelte'
  import DateInput from '$lib/components/inputs/DateInput.svelte'
  import NumberInput from '$lib/components/inputs/NumberInput.svelte'
  import ModalEditor from '$lib/components/ModalEditor.svelte'
  import type { Load } from '@sveltejs/kit'
  import { formatDistanceToNow } from 'date-fns'
  import debounce from 'debounce'
  import { aMonthInTheFuture } from '$lib/utils'


  export const load: Load = async ({ fetch }) => {
    const invoices = await trpc(fetch).query('invoices:browse')
    return { props: { invoices } }
  }
</script>

<script lang="ts">
  type Invoice = InferMutationInput<'invoices:save'>
  type EditorErrors = {
    invoiceNo: string
    company: string
    date?: string
    dueDate?: string
  } | void

  const newInvoice = (): Invoice => ({
    date: new Date(),
    dueDate: new Date(aMonthInTheFuture()),
    companyId: ''
  })

  let loading = false
  let query = ''
  export let invoices: InferQueryOutput<'invoices:browse'> = []
  let invoice = newInvoice()
  let editorVisible = false
  let editorBusy = false
  let editorErrors: EditorErrors

  const reloadInvoices = async () => {
    loading = true
    invoices = await trpc().query('invoices:browse', query)
    loading = false
  }

  const getCompanyOptions = () =>
    trpc()
      .query('companies:list')
      .then((companies) =>
        companies.map(({ uid, name }) => ({
          value: uid,
          label: `${name}`
        }))
      )

  const handleFilter = debounce((e: CustomEvent<string>) => {
    query = e.detail
    reloadInvoices()
  }, 500)

  const handleAdd = () => {
    invoice = newInvoice()
    editorErrors = undefined
    editorVisible = true
  }

  const handleEdit = async (e: CustomEvent<{ itemKey: number }>) => {
    editorErrors = undefined
    editorBusy = true
    editorVisible = true
    const data = await trpc().query('invoices:read', e.detail.itemKey)
    if (data) invoice = { ...(data || '') }
    editorBusy = false
  }

  const handleDelete = async (
    e: CustomEvent<{ itemKey: number }>
  ) => {
    loading = true
    await trpc().mutation('invoices:delete', e.detail.itemKey)
    reloadInvoices()
  }

  const handleEditorClose = () => {
    editorVisible = false
    invoice = newInvoice()
    editorErrors = undefined
  }

  const handleEditorSave = async () => {
    editorBusy = true
    try {
      await trpc().mutation('invoices:save', invoice)
      editorVisible = false
      invoice = newInvoice()
      reloadInvoices()
    } catch (err) {
      editorErrors = getEditorErrors(err)
    }
    editorBusy = false
  }
</script>

<svelte:head>
  <title>Invoices • Invoicestall</title>
</svelte:head>

<DataTable
  {loading}
  title="Invoices"
  filterDescription="title or company"
  items={invoices}
  key="invoiceNo"
  columns={[
    { title: 'InvoiceNo', prop: 'invoiceNo' },
    {
      title: 'Company',
      render: ({ company: { name } }) => `${name}`
    },
    {
      title: 'Last updated',
      render: ({ updatedAt }) =>
        formatDistanceToNow(updatedAt) + ' ago',
      textAlign: 'right'
    }
  ]}
  on:filter={handleFilter}
  on:add={handleAdd}
  on:edit={handleEdit}
  on:delete={handleDelete}
/>

<ModalEditor
  title={invoice.invoiceNo ? invoice.invoiceNo : 'New invoice'}
  visible={editorVisible}
  busy={editorBusy}
  on:close={handleEditorClose}
  on:save={handleEditorSave}
>
<div class="grid">
    {#if invoice.invoiceNo}
      <NumberInput
        label="Invoice number"
        bind:value={invoice.invoiceNo} 
        error={editorErrors?.invoiceNo}
      />
    {/if}
    <Select
      label="Company"
      required
      getOptions={getCompanyOptions}
      bind:value={invoice.companyId}
      error={editorErrors?.companyId}
    />
    <DateInput
      label="Date"
      required
      bind:value={invoice.date}
      error={editorErrors?.date}
    />
    <DateInput
      label="Due Date"
      required
      bind:value={invoice.dueDate}
      error={editorErrors?.dueDate}
    />
  </div>
</ModalEditor>
