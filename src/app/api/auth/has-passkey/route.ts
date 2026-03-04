import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ hasPasskey: false })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      AuthMethod: true,
    },
  })

  if (!user) {
    return NextResponse.json({ hasPasskey: false })
  }

  const hasPasskey = user.AuthMethod.length > 0

  return NextResponse.json({ hasPasskey })
}