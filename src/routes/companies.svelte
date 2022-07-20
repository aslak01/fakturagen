<script context="module" lang="ts">
  import getEditorErrors from '$lib/client/getEditorErrors'
  import type {
    InferMutationInput,
    InferQueryOutput
  } from '$lib/client/trpc'
  import trpc from '$lib/client/trpc'
  import DataTable from '$lib/components/DataTable.svelte'
  // import TextareaInput from '$lib/components/inputs/TextareaInput.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte'
  import ModalEditor from '$lib/components/ModalEditor.svelte'
  import type { Load } from '@sveltejs/kit'
  import { formatDistanceToNow } from 'date-fns'
  import debounce from 'debounce'

  export const load: Load = async ({ fetch }) => {
    const companies = await trpc(fetch).query('companies:browse')
    return { props: { companies } }
  }
</script>

<script lang="ts">
  type company = InferMutationInput<'companies:save'>
  type EditorErrors = {
    name?: string
    orgNo?: string
    street?: string
    poNo?: string
    city?: string
    currency?: string
  } | void

  const newCompany = (): company => ({
    uid: '',
    ownCompany: false,
    name: '',
    orgNo: '',
    street: '',
    poNo: '',
    city: '',
    currency: ''
  })

  let loading = false
  let query = ''
  export let companies: InferQueryOutput<'companies:browse'> = []
  let company = newCompany()
  let editorErrors: EditorErrors
  let editorVisible = false
  let editorBusy = false

  const reloadCompanies = async () => {
    loading = true
    companies = await trpc().query('companies:browse', query)
    loading = false
  }

  const handleFilter = debounce((e: CustomEvent<string>) => {
    query = e.detail
    reloadCompanies()
  }, 500)

  const handleAdd = () => {
    company = newCompany()
    editorErrors = undefined
    editorVisible = true
  }

  const handleEdit = async (e: CustomEvent<{ itemKey: string }>) => {
    editorErrors = undefined
    editorBusy = true
    editorVisible = true
    const data = await trpc().query(
      'companies:read',
      e.detail.itemKey
    )
    if (data) company = { ...data, orgNo: data.orgNo || '' }
    editorBusy = false
  }

  const handleDelete = async (
    e: CustomEvent<{ itemKey: string }>
  ) => {
    loading = true
    await trpc().mutation('companies:delete', e.detail.itemKey)
    reloadCompanies()
  }

  const handleEditorClose = () => {
    editorVisible = false
    company = newCompany()
    editorErrors = undefined
  }

  const handleEditorSave = async () => {
    editorBusy = true
    try {
      await trpc().mutation('companies:save', company)
      editorVisible = false
      company = newCompany()
      reloadCompanies()
    } catch (err) {
      editorErrors = getEditorErrors(err)
    }
    editorBusy = false
  }
</script>

<svelte:head>
  <title>Companies</title>
</svelte:head>

<DataTable
  {loading}
  title="Companies"
  filterDescription="first or last name"
  items={companies}
  key="uid"
  columns={[
    { title: 'Name', prop: 'name' },
    { title: 'Organisation number', prop: 'orgNo' },
    {
      title: 'Invoices',
      textAlign: 'right',
      render: (company) => company._count.invoices
    },
    {
      title: 'Last updated',
      textAlign: 'right',
      render: ({ updatedAt }) =>
        formatDistanceToNow(updatedAt) + ' ago'
    }
  ]}
  on:filter={handleFilter}
  on:add={handleAdd}
  on:edit={handleEdit}
  on:delete={handleDelete}
/>

<ModalEditor
  title={company.uid
    ? `${company.name} ${company.orgNo}`
    : 'New company'}
  visible={editorVisible}
  busy={editorBusy}
  on:close={handleEditorClose}
  on:save={handleEditorSave}
>
  <div class="grid">
    <TextInput
      label="Name"
      required
      bind:value={company.name}
      error={editorErrors?.name}
    />
    <TextInput
      label="orgNo"
      required
      bind:value={company.orgNo}
      error={editorErrors?.orgNo}
    />
    <TextInput
      label="street"
      required
      bind:value={company.street}
      error={editorErrors?.street}
    />
    <TextInput
      label="poNo"
      required
      bind:value={company.poNo}
      error={editorErrors?.poNo}
    />
    <TextInput
      label="city"
      required
      bind:value={company.city}
      error={editorErrors?.city}
    />
    <TextInput
      label="currency"
      required
      bind:value={company.currency}
      error={editorErrors?.currency}
    />
  </div>
  <!-- <TextareaInput label="street" bind:value={company.street} error={editorErrors?.street} /> -->
</ModalEditor>
