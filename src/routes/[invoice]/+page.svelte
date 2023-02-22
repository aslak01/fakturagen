<!-- </script> -->
<!-- <script lang="ts"> -->
<!-- 	export let invoice; -->
<!-- 	console.log(invoice); -->
<!-- </script> -->

<!-- <script context="module" lang="ts"> -->
<!-- 	// import getEditorErrors from '$lib/client/getEditorErrors' -->
<!-- 	// import type { -->
<!-- 	//   InferMutationInput, -->
<!-- 	//   InferQueryOutput -->
<!-- 	// } from '$lib/client/trpc' -->
<!-- 	import trpc from '$lib/client/trpc'; -->
<!-- 	// import DataTable from '$lib/components/DataTable.svelte' -->
<!-- 	// import Select from '$lib/components/inputs/Select.svelte' -->
<!-- 	// import TextInput from '$lib/components/inputs/TextInput.svelte' -->
<!-- 	// import DateInput from '$lib/components/inputs/DateInput.svelte' -->
<!-- 	// import NumberInput from '$lib/components/inputs/NumberInput.svelte' -->
<!-- 	// import ModalEditor from '$lib/components/ModalEditor.svelte' -->
<!-- 	import type { Load } from '@sveltejs/kit'; -->
<!-- 	// import { formatDistanceToNow } from 'date-fns' -->
<!-- 	// import debounce from 'debounce' -->
<!-- 	// import { aMonthInTheFuture } from '$lib/utils' -->
<!---->
<!-- 	export const load: Load = async ({ fetch, params }) => { -->
<!-- 		console.log(params); -->
<!-- 		const number = Number(params.invoice); -->
<!-- 		const invoice = await trpc(fetch).query('invoices:read', number); -->
<!-- 		return { props: { invoice } }; -->
<!-- 	}; -->
