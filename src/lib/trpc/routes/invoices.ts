import prisma from '$lib/prisma';
import { logger } from '$lib/trpc/middleware/logger';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

export const invoices = t.router({
	list: t.procedure
		.use(logger)
		.input(z.string().optional())
		.query(({ input }) =>
			prisma.invoice
				.findMany({
					select: {
						invoiceNo: true,
						companyId: true,
						company: { select: { name: true } },
						date: true,
						dueDate: true,
						createdAt: true,
						updatedAt: true,
						lines: true
					},
					orderBy: { invoiceNo: 'desc' },
					where: input
						? {
								OR: [{ company: { name: { contains: input } } }]
						  }
						: undefined
				})
				.then((invoices) => invoices.map((invoice) => ({ ...invoice })))
		),

	load: t.procedure
		.use(logger)
		.input(z.number())
		.query(({ input }) =>
			prisma.invoice
				.findUniqueOrThrow({
					select: {
						invoiceNo: true,
						companyId: true,
						date: true,
						dueDate: true,
						createdAt: true,
						updatedAt: true
					},
					where: { invoiceNo: input }
				})
				.then(({ companyId, ...rest }) => ({
					...rest,
					companyId
				}))
		),

	save: t.procedure
		.use(logger)
		.input(
			z.object({
				invoiceNo: z.number().nullable(),
				companyId: z.string().min(1, 'Should be selected'),
				date: z.date(),
				dueDate: z.date()
				// title: z.string(),
				// // price: z.custom<DecimalJsLike>(),
				// price: z.string(),
				// excerpt: z.string().nullable(),
				// authorId: z.string(),
				// storeIds: z.array(z.string())
			})
		)
		.mutation(async ({ input: { invoiceNo, ...rest } }) => {
			if (invoiceNo) {
				await prisma.invoice.update({
					data: {
						...rest,
						stores: { connect: storeIds.map((id) => ({ id })) },
						updatedByUserId: userId
					},
					where: { id }
				});
			} else {
				await prisma.book.create({
					data: {
						...rest,
						stores: { connect: storeIds.map((id) => ({ id })) },
						updatedByUserId: userId
					}
				});
			}
		}),

	delete: t.procedure
		.use(logger)
		.use(auth) // 👈 use auth middleware
		.input(z.string())
		.mutation(async ({ input: id }) => {
			await prisma.book.delete({ where: { id } });
		})
});
