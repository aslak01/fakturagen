import prismaClient from '$lib/server/prismaClient'
import { falsyToNull, trim } from '$lib/utils/zodTransformers'
import * as trpc from '@trpc/server'
import Decimal from 'decimal.js'
import { z } from 'zod'

export default trpc
  .router()
  .query('browse', {
    input: z.string().optional(),
    resolve: ({ input }) =>
      prismaClient.invoice.findMany({
        select: {
          uid: true,
          companyId: true,
          invoiceNo: true,
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
        orderBy: [{ invoiceNo: 'asc' }]
      })
  })
  .query('list', {
    resolve: () =>
      prismaClient.invoice.findMany({
        select: {
          uid: true,
          invoiceNo: true,
          company: { select: { name: true } }
        },
        orderBy: [{ invoiceNo: 'asc' }]
      })
  })
  .query('read', {
    input: z.string(),
    resolve: ({ input: uid }) =>
      prismaClient.invoice.findUnique({
        where: { uid },
        select: {
          uid: true,
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
      uid: z.string().nullable(),
      invoiceNo: z.string().max(50).transform(trim),
      companyId: z.string().min(1, 'Should be selected'),
      date: z.string().refine(
        (val) => {
          try {
            new Decimal(val)
            return true
          } catch {
            return false
          }
        },
        { message: 'Valid number required' }
      ),
      dueDate: z
        .string()
        .max(1000)
        .transform(trim)
        .transform(falsyToNull)
    }),
    resolve: ({ input: { uid, ...data } }) =>
      uid
        ? prismaClient.invoice.update({
            data,
            where: { uid },
            select: { uid: true }
          })
        : prismaClient.invoice.create({ data, select: { uid: true } })
  })
  .mutation('delete', {
    input: z.string(),
    resolve: ({ input: uid }) =>
      prismaClient.invoice
        .delete({ where: { uid } })
        .then(() => undefined)
  })
