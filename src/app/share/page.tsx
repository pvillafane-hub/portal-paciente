import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ShareClient from './share-client'

export default async function SharePage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const userId = getSessionUserId()
  if (!userId) redirect('/login')

  const documents = await prisma.document.findMany({
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

        {searchParams.token && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-8">
            <p className="font-semibold text-lg mb-2">
              Enlace generado:
            </p>

            <input
              value={`http://localhost:3000/s/${searchParams.token}`}
              readOnly
              className="w-full border p-3 rounded-lg text-lg"
            />

            <p className="text-gray-600 mt-2">
              Copia este enlace y compártelo con tu médico o familiar.
            </p>
          </div>
        )}

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
