import type { inferAsyncReturnType } from '@trpc/server'
import * as trpc from '@trpc/server'
import trpcTransformer from 'trpc-transformer'
import companies from './companies'
import invoices from './invoices'
// import stores from './stores';

export const createContext = async () => ({})

export const router = trpc
  .router<inferAsyncReturnType<typeof createContext>>()
  .transformer(trpcTransformer)
  .merge('companies:', companies)
  .merge('invoices:', invoices)
// .merge('stores:', stores);

export type Router = typeof router
