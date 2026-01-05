'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function uploadDocument(formData: FormData) {
  const file = formData.get('file') as File
  const docType = formData.get('docType') as string
  const facility = formData.get('facility') as string
  const studyDateRaw = formData.get('studyDate') as string

  if (!file || file.size === 0) {
    throw new Error('Archivo requerido')
  }

  if (!docType || !facility || !studyDateRaw) {
    throw new Error('Metadata incompleta')
  }

  const studyDate = new Date(studyDateRaw)
  const userId = 'test-user-1'

  // Guardar archivo
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const fileName = `${Date.now()}-${file.name}`
  const uploadPath = path.join(process.cwd(), 'public/uploads', fileName)

  await writeFile(uploadPath, buffer)

  // Guardar metadata
  await prisma.document.create({
    data: {
      filename: file.name,
      filePath: `/uploads/${fileName}`,
      docType,
      facility,
      studyDate,
      userId,
    },
  })

  redirect('/view')
}
