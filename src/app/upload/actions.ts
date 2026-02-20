'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getSessionUserId } from '@/lib/auth'
import { auditLog } from '@/lib/audit'

export async function uploadDocument(formData: FormData) {
  const file = formData.get('file') as File
  const docType = formData.get('docType') as string
  const facility = formData.get('facility') as string
  const studyDate = formData.get('studyDate') as string

  if (!file || file.size === 0) {
    throw new Error('Archivo requerido')
  }

  if (!docType || !facility || !studyDate) {
    throw new Error('Metadata incompleta')
  }

  const userId = getSessionUserId()
  if (!userId) redirect('/login')

  // Guardar archivo
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const fileName = `${Date.now()}-${file.name}`
  const uploadPath = path.join(process.cwd(), 'public/uploads', fileName)

  await writeFile(uploadPath, buffer)

  // Guardar metadata
  const document = await prisma.document.create({
    data: {
      filename: file.name,
      filePath: `/uploads/${fileName}`,
      docType,
      facility,
      studyDate, // 👈 string puro
      userId,
    },
  })

  // Audit log
  await auditLog({
    userId,
    action: 'UPLOAD_DOCUMENT',
    entityId: document.id,
    metadata: {
      filename: document.filename,
      docType: document.docType,
      facility: document.facility,
    },
  })

  redirect('/view')
}
