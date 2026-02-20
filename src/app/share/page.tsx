export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import ShareClient from './share-client'
import { getSessionUserId } from '@/lib/auth'

let prisma: any

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client')
    prisma = new PrismaClient()
  }
  return prisma
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const userId = getSessionUserId()
  if (!userId) redirect('/login')

  const db = await getPrisma()

  const documents = await db.document.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-sm">
        <h2 className="text-3xl font-bold mb-8">
          Compartir documento
        </h2>

        {documents.length === 0 ? (
          <p className="text-xl text-gray-500">
            No tienes documentos para compartir.
          </p>
        ) : (
          <ShareClient documents={documents} />
        )}
      </div>
    </div>
  )
}
