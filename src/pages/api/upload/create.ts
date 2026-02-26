import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 🔐 1️⃣ Validar sesión
    const sessionId = req.cookies['pp-session']

    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized - No session cookie' })
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }

    const userId = session.userId

    // 📦 2️⃣ Obtener datos enviados desde el frontend
    const { filename, filePath, docType, facility, studyDate } = req.body

    if (!filename || !filePath || !docType || !facility || !studyDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 🗂 3️⃣ Crear documento correctamente
    const document = await prisma.document.create({
      data: {
        userId,
        filename,
        filePath,
        docType,
        facility,
        studyDate,
      },
    })

    return res.status(200).json(document)
  } catch (error) {
    console.error('UPLOAD CREATE ERROR:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}