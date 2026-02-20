import type { NextApiRequest, NextApiResponse } from 'next'
import { writeFile } from 'fs/promises'
import path from 'path'

let prisma: any

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client')
    prisma = new PrismaClient()
  }
  return prisma
}

export const config = {
  api: {
    bodyParser: false,
  },
}

import formidable from 'formidable'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const db = await getPrisma()

  const form = formidable({ multiples: false })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid form data' })
    }

    const file = files.file as formidable.File
    const docType = fields.docType as string
    const facility = fields.facility as string
    const studyDate = fields.studyDate as string

    const userId = req.cookies.userId
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!file) {
      return res.status(400).json({ error: 'Archivo requerido' })
    }

    const data = await fs.readFile(file.filepath)
    const fileName = `${Date.now()}-${file.originalFilename}`
    const uploadPath = path.join(process.cwd(), 'public/uploads', fileName)

    await writeFile(uploadPath, data)

    const document = await db.document.create({
      data: {
        filename: file.originalFilename || fileName,
        filePath: `/uploads/${fileName}`,
        docType,
        facility,
        studyDate,
        userId,
      },
    })

    return res.status(200).json({ success: true })
  })
}
