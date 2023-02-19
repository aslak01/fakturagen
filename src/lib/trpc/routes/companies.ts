import prisma from '$lib/prisma';
import { logger } from '$lib/trpc/middleware/logger';
import { trim } from '$lib/utils/zodTransformers';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

export const companies = t.router({
	list: t.procedure.input(z.string().optional()).query(({ input }) =>
		prisma.company.findMany({
			select: {
				uid: true,
				name: true,
				orgNo: true,
				street: true,
				poNo: true,
				city: true,
				currency: true,
				createdAt: true,
				updatedAt: true,
				_count: { select: { invoices: true } }
			},
			orderBy: { updatedAt: 'desc' },
			where: input
				? {
						OR: [{ name: { contains: input } }]
				  }
				: undefined
		})
	),

	loadOptions: t.procedure.use(logger).query(() =>
		prisma.company
			.findMany({
				select: { uid: true, name: true },
				orderBy: [{ name: 'asc' }]
			})
			.then((companies) =>
				companies.map(({ uid, name }) => ({
					label: name,
					value: uid
				}))
			)
	),

	load: t.procedure
		.use(logger)
		.input(z.string())
		.query(({ input }) =>
			prisma.company.findUniqueOrThrow({
				select: {
					uid: true,
					ownCompany: true,
					name: true,
					orgNo: true,
					street: true,
					poNo: true,
					city: true,
					currency: true,
					createdAt: true,
					updatedAt: true,
					banks: true,
					invoices: true
				},
				where: { uid: input }
			})
		),

	save: t.procedure
		.use(logger)
		.input(
			z.object({
				uid: z.string().nullable(),
				ownCompany: z.boolean(),
				name: z.string().min(3).max(50).transform(trim),
				orgNo: z.string().min(5).max(10).transform(trim),
				street: z.string().min(1).max(100).transform(trim),
				poNo: z.string().min(1).max(100).transform(trim),
				city: z.string().min(1).max(100).transform(trim),
				currency: z.string().min(1).max(100).transform(trim)
			})
		)
		.mutation(async ({ input: { uid, ...rest } }) => {
			if (uid) {
				await prisma.company.update({
					data: { ...rest },
					where: { uid }
				});
			} else {
				await prisma.company.create({
					data: { ...rest }
				});
			}
		}),

	delete: t.procedure
		.use(logger)
		.input(z.string())
		.mutation(async ({ input: uid }) => {
			await prisma.company.delete({ where: { uid } });
		})
});
