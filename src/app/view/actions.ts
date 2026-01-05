'use server'

import { prisma } from '@/lib/prisma'

export async function getDocuments() {
  return prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
  })
}
