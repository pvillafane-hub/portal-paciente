import type { NextApiRequest, NextApiResponse } from "next"
import crypto from "crypto"

let prisma: any

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import("@prisma/client")
    prisma = new PrismaClient()
  }
  return prisma
}

type ResponseData =
  | { token: string }
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

    const db = await getPrisma()

    const { documentId, days } = req.body

    // 🔎 Validar documentId
    if (!documentId || typeof documentId !== "string") {
      return res.status(400).json({ error: "Invalid documentId" })
    }

    // 🔎 Validar expiración permitida
    const allowedDays = [1, 7, 30]

    const expirationDays = Number(days)

    if (!allowedDays.includes(expirationDays)) {
      return res.status(400).json({ error: "Invalid expiration option" })
    }

    // 🔐 Validar sesión
    const sessionId = req.cookies.pp_session

    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized - No session" })
    }

    const session = await db.session.findUnique({
      where: { id: sessionId },
    })

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired session" })
    }

    const userId = session.userId

    // 📄 Validar documento del usuario
    const doc = await db.document.findFirst({
      where: {
        id: documentId,
        userId,
        deletedAt: null,
      },
    })

    if (!doc) {
      return res.status(404).json({ error: "Document not found" })
    }

    // 🔗 Generar token seguro
    const token = crypto.randomUUID()

    // ⏳ Calcular expiración
    const expiresAt = new Date(
      Date.now() + expirationDays * 24 * 60 * 60 * 1000
    )

    // 💾 Guardar enlace
    await db.shareLink.create({
      data: {
        documentId,
        token,
        expiresAt,
      },
    })

    return res.status(200).json({ token })

  } catch (err) {

    console.error("SHARE CREATE ERROR:", err)

    return res.status(500).json({
      error: "Internal server error",
    })
  }
}