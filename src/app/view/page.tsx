import { getDocuments, deleteDocument } from './actions'
import Link from 'next/link'

export default async function ViewPage({
  searchParams,
}: {
  searchParams: { deleted?: string }
}) {
  const documents = await getDocuments()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-sm">

        <h2 className="text-3xl font-bold mb-8">
          Mis documentos médicos
        </h2>

        {searchParams.deleted && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-6 text-lg">
            Documento eliminado correctamente.
          </div>
        )}

        {documents.length === 0 && (
          <p className="text-xl text-gray-500">
            No has subido documentos todavía.
          </p>
        )}

        <div className="space-y-6">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="border rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-2">
                <p className="text-xl font-semibold">
                  {doc.filename}
                </p>

                <p className="text-gray-700 text-lg">
                  <strong>{doc.docType}</strong> · {doc.facility}
                </p>

                <p className="text-base text-gray-500">
                  Fecha del estudio:{' '}
                  {new Date(doc.studyDate).toLocaleDateString('es-PR')}
                </p>
              </div>

              <div className="mt-6 md:mt-0 flex flex-wrap gap-4">
                <a
                  href={doc.filePath}
                  target="_blank"
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Ver documento
                </a>

                <Link
                  href="/share"
                  className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Compartir
                </Link>

                <form action={deleteDocument}>
                  <input type="hidden" name="documentId" value={doc.id} />
                  <button
                    type="submit"
                    className="bg-red-100 text-red-700 px-5 py-3 rounded-xl font-semibold hover:bg-red-200 transition"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
