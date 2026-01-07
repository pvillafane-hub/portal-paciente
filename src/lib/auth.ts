import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'pp_session'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function setSession(userId: string) {
  cookies().set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

export function getSessionUserId(): string | null {
  return cookies().get(SESSION_COOKIE)?.value ?? null
}

export function clearSession() {
  cookies().delete(SESSION_COOKIE)
}
