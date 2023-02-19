import prismaClient from '$lib/server/prismaClient';
import { trim } from '$lib/utils/zodTransformers';
import * as trpc from '@trpc/server';
import { z } from 'zod';

export default trpc
	.router()
	.query('browse', {
		input: z.string().optional(),
		resolve: ({ input }) =>
			prismaClient.company.findMany({
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
				where: input
					? {
							OR: [{ name: { contains: input } }]
					  }
					: undefined,
				orderBy: [{ name: 'asc' }]
			})
	})
	.query('list', {
		resolve: () =>
			prismaClient.company.findMany({
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
					banks: true,
					invoices: true
				},
				orderBy: [{ name: 'asc' }]
			})
	})
	.query('read', {
		input: z.string(),
		resolve: ({ input: uid }) =>
			prismaClient.company.findUnique({
				where: { uid },
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
				}
			})
	})
	.mutation('save', {
		input: z.object({
			uid: z.string(),
			ownCompany: z.boolean(),
			name: z.string().min(3).max(50).transform(trim),
			orgNo: z.string().min(5).max(10).transform(trim),
			street: z.string().min(1).max(100).transform(trim),
			poNo: z.string().min(1).max(100).transform(trim),
			city: z.string().min(1).max(100).transform(trim),
			currency: z.string().min(1).max(100).transform(trim)
		}),
		resolve: ({ input: { uid, ...data } }) =>
			uid
				? prismaClient.company.update({
						data,
						where: { uid },
						select: { uid: true }
				  })
				: prismaClient.company.create({ data, select: { uid: true } })
	})
	.mutation('delete', {
		input: z.string(),
		resolve: ({ input: uid }) =>
			prismaClient.company.delete({ where: { uid } }).then(() => undefined)
	});
