import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { email } = req.body

  if (!email) {
    return res.status(200).json({ message: 'OK' })
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = await bcrypt.hash(rawToken, 10)

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    // ⚠ Aquí luego conectamos tu sistema de email
    console.log(
      `RESET LINK: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${rawToken}`
    )
  }

  // Siempre devolver 200
  return res.status(200).json({ message: 'OK' })
}