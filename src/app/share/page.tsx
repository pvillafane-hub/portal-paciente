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
    <div>
      <h2 className="text-3xl font-bold mb-6">Compartir documento</h2>

      {searchParams.token && (
        <div className="bg-green-50 p-4 rounded border mb-6">
          <p className="font-medium mb-2">Enlace generado:</p>
          <input
           value={`http://localhost:3000/s/${searchParams.token}`}
           readOnly
          className="w-full border p-2"
        />

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
  )
}

