import { companies } from "$lib/trpc/routes/companies";
import { invoices } from "$lib/trpc/routes/invoices";
import { t } from "$lib/trpc/t";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const router = t.router({
	companies,
	invoices,
});

export type Router = typeof router;

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
