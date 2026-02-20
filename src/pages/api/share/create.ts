import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { getSessionUserId } from '@/lib/auth'

let prisma: any

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client')
    prisma = new PrismaClient()
  }
  return prisma
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db = await getPrisma()

    const { documentId, days } = req.body
    const userId = getSessionUserId(req)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const doc = await db.document.findFirst({
      where: {
        id: documentId,
        userId,
        deletedAt: null,
      },
    })

    if (!doc) {
      return res.status(400).json({ error: 'Documento no válido.' })
    }

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

    await db.shareLink.create({
      data: {
        documentId,
        token,
        expiresAt,
      },
    })

    return res.status(200).json({ token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
