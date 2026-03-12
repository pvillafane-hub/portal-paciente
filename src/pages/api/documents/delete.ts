import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { s3 } from "@/lib/s3"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

type ResponseData =
  | { ok: true }
  | { error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  // 🔐 Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { documentId } = req.body

    // 🔎 Validar documentId
    if (!documentId || typeof documentId !== "string") {
      return res.status(400).json({ error: "Invalid document ID" })
    }

    // 🔐 Validar sesión
    const sessionId = req.cookies.pp_session

    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized - No session" })
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired session" })
    }

    const userId = session.userId

    // 📄 Buscar documento del usuario
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    })

    if (!document) {
      return res.status(404).json({ error: "Document not found" })
    }

    // ☁️ Eliminar archivo en S3
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: document.filePath,
      })
    )

    // 🧹 Eliminar enlaces compartidos
    await prisma.shareLink.deleteMany({
      where: { documentId },
    })

    // 🗑 Eliminar documento
    await prisma.document.delete({
      where: { id: documentId },
    })

    return res.status(200).json({ ok: true })

  } catch (error) {

    console.error("DELETE DOCUMENT ERROR:", error)

    return res.status(500).json({
      error: "Internal server error",
    })
  }
}