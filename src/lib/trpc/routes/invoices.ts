import prisma from '$lib/prisma';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { aMonthInTheFuture } from '$lib/utils';

export const invoices = t.router({
  list: t.procedure
    .use(logger)
    .input(z.string().optional())
    .query(({ input }) =>
      prisma.invoice
        .findMany({
          select: {
            id: true,
            number: true,
            company: { select: { name: true } },
            date: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
            lines: true,
            paid: true,
            sum: true,
            currValue: true
          },
          orderBy: { number: 'desc' },
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
    .input(z.string())
    .query(({ input }) =>
      prisma.invoice
        .findUniqueOrThrow({
          select: {
            id: true,
            number: true,
            companyId: true,
            date: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
            paid: true,
            sum: true
          },
          where: { id: input }
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
        id: z.string(),
        number: z.number(),
        companyId: z.string().min(1, 'Should be selected'),
        date: z.date().or(z.string()),
        dueDate: z.date().or(z.string()).default(new Date(aMonthInTheFuture())),
        paid: z.boolean(),
        sum: z.number().nullable()
      })
    )
    .mutation(async ({ input: { id, ...rest } }) => {
      if (id) {
        await prisma.invoice.update({
          data: {
            ...rest,
            // company: { connect: id => companyId }
            // stores: { connect: storeIds.map((id) => ({ id })) },
            // updatedByUserId: userId
          },
          where: { id }
        });
      } else {
        await prisma.invoice.create({
          data: {
            ...rest
          }
        });
      }
    }),

  delete: t.procedure
    .use(logger)
    .use(auth) // 👈 use auth middleware
    .input(z.string())
    .mutation(async ({ input: id }) => {
      await prisma.invoice.delete({ where: { id } });
    })
});
