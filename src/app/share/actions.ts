'use server'

import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { getSessionId } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function createShareLink(
  prevState: { token?: string; error?: string } | null,
  formData: FormData
) {

  const documentId = formData.get('documentId') as string
  const daysRaw = formData.get('days')

  const userId = getSessionId()
  if (!userId) redirect('/login')

  // Validar documentId
  if (!documentId || typeof documentId !== 'string') {
    return { error: 'Documento no válido.' }
  }

  // Validar expiración
  const days = Number(daysRaw)

  if (!Number.isFinite(days)) {
    return { error: 'Expiración inválida.' }
  }

  const allowedDays = [1, 7, 30]

  if (!allowedDays.includes(days)) {
    return { error: 'Expiración inválida.' }
  }

  // Verificar que el documento pertenece al usuario
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

  // Generar token único
  const token = crypto.randomUUID()

  // Calcular expiración
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

  // Guardar ShareLink
  await prisma.shareLink.create({
    data: {
      documentId,
      token,
      expiresAt,
    },
  })

  // Redirigir a página de share con token
  redirect(`/share?token=${token}`)
}