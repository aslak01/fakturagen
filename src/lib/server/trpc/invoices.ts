import prismaClient from '$lib/server/prismaClient'
// import { falsyToNull, trim } from '$lib/utils/zodTransformers'
// import { dateStringToIsoDate } from '$lib/utils/zodTransformers'
import * as trpc from '@trpc/server'
// import Decimal from 'decimal.js'
import { z } from 'zod'

export default trpc
  .router()
  .query('browse', {
    input: z.number().or(z.string()).optional(),
    resolve: ({ input }) =>
      prismaClient.invoice.findMany({
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
        where: input
          ? {
              OR: [{ company: { name: { contains: input } } }]
            }
          : undefined,
        orderBy: [{ invoiceNo: 'desc' }]
      })
  })

  .query('list', {
    resolve: () =>
      prismaClient.invoice.findMany({
        select: {
          invoiceNo: true,
          company: { select: { name: true } }
        },
        orderBy: [{ invoiceNo: 'desc' }]
      })
  })

  .query('read', {
    input: z.number(),
    resolve: ({ input: invoiceNo }) =>
      prismaClient.invoice.findUnique({
        where: { invoiceNo },
        select: {
          invoiceNo: true,
          companyId: true,
          date: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true
        }
      })
  })

  .mutation('save', {
    input: z.object({
      // invoiceNo: z.string().max(50).transform(trim),
      invoiceNo: z.number().or(z.undefined()),
      companyId: z.string().min(1, 'Should be selected'),
      date: z.date(),
      // date: z.string().refine(
      //   (val) => {
      //     try {
      //       new Decimal(val)
      //       return true
      //     } catch {
      //       return false
      //     }
      //   },
      //   { message: 'Valid number required' }
      // ),
      dueDate: z.date()
      // dueDate: z
      //   .string()
      //   .max(1000)
      //   .transform(trim)
      //   .transform(falsyToNull)
    }),

    resolve: ({ input: { invoiceNo, ...data } }) =>
      invoiceNo
        ? prismaClient.invoice.update({
            data,
            where: { invoiceNo },
            select: { invoiceNo: true }
          })
        : prismaClient.invoice.create({
            data,
            select: { invoiceNo: true }
          })
  })

  .mutation('delete', {
    input: z.number(),
    resolve: ({ input: invoiceNo }) =>
      prismaClient.invoice
        .delete({ where: { invoiceNo } })
        .then(() => undefined)
  })
