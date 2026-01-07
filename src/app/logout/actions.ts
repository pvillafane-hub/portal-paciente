'use server'

import { clearSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function logout() {
  clearSession()
  redirect('/login')
}
