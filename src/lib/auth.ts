import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const SESSION_COOKIE = 'pp_session'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function setSession(userId: string) {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  cookies().set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,   // 👈 AQUÍ lo añades
    path: '/',
  })
}

export function getSessionUserId(): string | null {
  return cookies().get(SESSION_COOKIE)?.value ?? null
}

export async function clearSession() {
  const sessionId = cookies().get(SESSION_COOKIE)?.value

  if (sessionId) {
    await prisma.session.deleteMany({
      where: { id: sessionId }
    })
  }

  cookies().delete(SESSION_COOKIE)
}