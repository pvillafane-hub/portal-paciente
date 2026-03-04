import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ hasPasskey: false })
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ hasPasskey: false })
  }

  const count = await prisma.authMethod.count({
    where: { userId: user.id },
  })

  return NextResponse.json({ hasPasskey: count > 0 })
}