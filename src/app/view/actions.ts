'use server'

import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function getDocuments() {
  const userId = getSessionUserId()
  if (!userId) redirect('/login')

  return prisma.document.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function deleteDocument(formData: FormData) {
  const userId = getSessionUserId()
  if (!userId) redirect('/login')

  const documentId = formData.get('documentId') as string
  if (!documentId) return

  // Validar ownership
  const doc = await prisma.document.findFirst({
    where: {
      id: documentId,
      userId,
      deletedAt: null,
    },
  })

  if (!doc) return

  await prisma.document.update({
    where: { id: documentId },
    data: {
      deletedAt: new Date(),
    },
  })
  redirect('/view?deleted=1')
}