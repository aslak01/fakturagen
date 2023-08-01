import prisma from "$lib/prisma";
import { auth } from "$lib/trpc/middleware/auth";
import { logger } from "$lib/trpc/middleware/logger";
import { trim } from "$lib/utils/zodTransformers";
import { t } from "$lib/trpc/t";
import { z } from "zod";

export const companies = t.router({
	list: t.procedure.input(z.string().optional()).query(({ input }) =>
		prisma.company.findMany({
			select: {
				id: true,
				name: true,
				orgNo: true,
				currency: true,
				address: true,
				createdAt: true,
				updatedAt: true,
				invoices: true,
				_count: { select: { invoices: true } },
			},
			orderBy: { updatedAt: "desc" },
			where: input
				? {
						OR: [{ name: { contains: input } }],
				  }
				: undefined,
		}),
	),

	loadOptions: t.procedure.use(logger).query(() =>
		prisma.company
			.findMany({
				select: { id: true, name: true },
				orderBy: [{ name: "asc" }],
			})
			.then((companies) =>
				companies.map(({ id, name }) => ({
					label: name,
					value: id,
				})),
			),
	),

	load: t.procedure
		.use(logger)
		.input(z.string())
		.query(({ input }) =>
			prisma.company.findUniqueOrThrow({
				select: {
					id: true,
					name: true,
					orgNo: true,
					currency: true,
					address: true,
					createdAt: true,
					updatedAt: true,
					bank: true,
					invoices: true,
				},
				where: { id: input },
			}),
		),

	save: t.procedure
		.use(logger)
		.input(
			z.object({
				id: z.string().nullable(),
				name: z.string().min(3).max(50).transform(trim),
				orgNo: z.string().min(5).max(10).transform(trim).nullable(),
				currency: z.string().min(1).max(100).transform(trim).nullable(),
			}),
		)
		.mutation(async ({ input: { id, ...rest } }) => {
			if (id) {
				await prisma.company.update({
					data: { ...rest },
					where: { id },
				});
			} else {
				await prisma.company.create({
					data: { ...rest },
				});
			}
		}),

	delete: t.procedure
		.use(logger)
		.input(z.string())
		.mutation(async ({ input: id }) => {
			await prisma.company.delete({ where: { id } });
		}),
});
