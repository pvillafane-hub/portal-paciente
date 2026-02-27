export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '@/lib/s3'

let prisma: any

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client')
    prisma = new PrismaClient()
  }
  return prisma
}

export default async function SharedDocumentPage({
  params,
}: {
  params: { token: string }
}) {
  const db = await getPrisma()

  const share = await db.shareLink.findUnique({
    where: { token: params.token },
    include: { document: true },
  })

  if (!share || share.expiresAt < new Date()) {
    notFound()
  }

  const key = share.document.filePath

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  })

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60,
  })

  redirect(signedUrl)
}