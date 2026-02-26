import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

// ⚠️ Necesario para usar formidable en Next.js
export const config = {
  api: {
    bodyParser: false,
  },
}

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
      return res.status(401).json({ error: 'Unauthorized - No session' })
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }

    const userId = session.userId

    // 📦 2️⃣ Procesar FormData con formidable
    const form = formidable({
      multiples: false,
      uploadDir: path.join(process.cwd(), '/public/uploads'),
      keepExtensions: true,
    })

    const [fields, files] = await form.parse(req)

    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ error: 'File is required' })
    }

    const filename = file.originalFilename || file.newFilename
    const filePath = `/uploads/${file.newFilename}`

    const docType = fields.docType?.toString() || ''
    const facility = fields.facility?.toString() || ''
    const studyDate = fields.studyDate?.toString() || ''

    if (!docType || !facility || !studyDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 🗂 3️⃣ Crear documento en DB
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