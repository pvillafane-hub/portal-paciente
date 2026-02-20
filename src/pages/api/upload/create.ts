import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { writeFile, readFile } from 'fs/promises'
import formidable, { File } from 'formidable'

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db = await getPrisma()
    const form = formidable({ multiples: false })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err)
        return res.status(400).json({ error: 'Invalid form data' })
      }

      // -------- FILE HANDLING --------

      const fileField = files.file

      if (!fileField) {
        return res.status(400).json({ error: 'Archivo requerido' })
      }

      const file: File = Array.isArray(fileField)
        ? fileField[0]
        : fileField

      // -------- FIELD HANDLING --------

      const docTypeField = fields.docType
      const facilityField = fields.facility
      const studyDateField = fields.studyDate

      const docType = Array.isArray(docTypeField)
        ? docTypeField[0]
        : docTypeField

      const facility = Array.isArray(facilityField)
        ? facilityField[0]
        : facilityField

      const studyDate = Array.isArray(studyDateField)
        ? studyDateField[0]
        : studyDateField

      if (!docType || !facility || !studyDate) {
        return res.status(400).json({ error: 'Metadata incompleta' })
      }

      // -------- AUTH --------

      const userId = req.cookies.userId
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // -------- SAVE FILE --------

      const data = await readFile(file.filepath)

      const fileName = `${Date.now()}-${file.originalFilename}`
      const uploadPath = path.join(process.cwd(), 'public/uploads', fileName)

      await writeFile(uploadPath, data)

      // -------- SAVE DB --------

      await db.document.create({
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
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
