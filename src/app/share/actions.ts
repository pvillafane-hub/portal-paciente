'use server'

import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { getSessionUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function createShareLink(
  
  prevState: { token?: string; error?: string } | null,
  formData: FormData
  
) {
  const documentId = formData.get('documentId') as string
  const days = Number(formData.get('days'))

  const userId = getSessionUserId()
  if (!userId) redirect('/login')

  const doc = await prisma.document.findFirst({
    where: {
      id: documentId,
      userId,
      deletedAt: null,
    },
  })

  if (!doc) {
    return { error: 'Documento no válido.' }
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

  await prisma.shareLink.create({
    data: {
      documentId,
      token,
      expiresAt,
    },
  })

  redirect(`/share?token=${token}`)

}
