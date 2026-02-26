import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma' // ajusta según tu proyecto

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sessionId = req.cookies['pp-session']

    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized - No session cookie' })
    }

    // Buscar sesión en base de datos
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session) {
      return res.status(401).json({ error: 'Invalid session' })
    }

    const userId = session.user.id

    // Ahora sí puedes crear el upload
    const upload = await prisma.document.create({
      data: {
        userId,
        // demás campos...
      },
    })

    return res.status(200).json(upload)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}