export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'

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

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white p-6 rounded-xl border">
      <h2 className="text-2xl font-bold mb-4">
        Documento compartido
      </h2>

      <p className="mb-4">{share.document.filename}</p>

      <a
        href={share.document.filePath}
        target="_blank"
        className="text-blue-600 underline text-lg"
      >
        Abrir documento
      </a>
    </div>
  )
}
