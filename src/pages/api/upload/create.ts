import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import formidable from 'formidable'
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { randomUUID } from "crypto";
import fs from "fs";

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
    const sessionId = req.cookies.pp_session

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
      keepExtensions: true,
    })

    const [ fields, files ] = await form.parse(req)

    const file = Array.isArray(files.file)
      ? files.file[0]
      : files.file

    if (!file) {
      return res.status(400).json({ error: 'File is required' })
    }

    const filename = file.originalFilename || file.newFilename

    const docTypeRaw = fields.docType
    const facilityRaw = fields.facility
    const studyDateRaw = fields.studyDate

    const docType = Array.isArray(docTypeRaw)
      ? docTypeRaw[0]
      : docTypeRaw || ''

   const facility = Array.isArray(facilityRaw)
      ? facilityRaw[0]
      : facilityRaw || ''

   const studyDate = Array.isArray(studyDateRaw)
      ? studyDateRaw[0]
      : studyDateRaw || ''

    if (!docType || !facility || !studyDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 📥 3️⃣ Leer archivo temporal creado por formidable
    const fileBuffer = fs.readFileSync(file.filepath)

    // 📌 Generar key único en S3
    const key = `${userId}/${randomUUID()}-${filename}`

    // ☁️ 4️⃣ Subir a S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: file.mimetype || "application/octet-stream",
      })
    )

  

    // 🗂 5️⃣ Guardar documento en DB
    const document = await prisma.document.create({
      data: {
        userId,
        filename,
        filePath: key,
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