import { getDocuments } from './actions'
import { deleteDocument } from './actions'
import Link from 'next/link'

export default async function ViewPage({
  searchParams,
}: {
  searchParams: { deleted?: string }
}) {

  const documents = await getDocuments()

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Mis documentos médicos</h2>
      {searchParams.deleted && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded mb-6">
          Documento eliminado correctamente.
      </div>
    )}

      {documents.length === 0 && (
        <p className="text-xl text-gray-500">
          No has subido documentos todavía.
        </p>
      )}

      <div className="space-y-4">
        {documents.map(doc => (
          <div
            key={doc.id}
            className="bg-white border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <p className="text-lg font-medium">
                {doc.filename}
              </p>

              <p className="text-gray-700">
                <strong>{doc.docType}</strong> · {doc.facility}
              </p>


              <p className="text-base text-gray-500">
                Fecha del estudio:{' '}
                {new Date(doc.studyDate).toLocaleDateString('es-PR')}
              </p>
            </div>

           <div className="mt-4 md:mt-0 flex gap-4 text-lg">
             <a
               href={doc.filePath}
               target="_blank"
               className="text-blue-600 underline"
          >
               Ver
          </a>

          <Link
            href="/share"
            className="text-green-600 underline"
          >
            Compartir
          </Link>

          <form action={deleteDocument}>
          <input type="hidden" name="documentId" value={doc.id} />
          <button
            type="submit"
            className="text-red-600 underline"
          >
            Eliminar
          </button>
        </form>
       </div>
          </div>
        ))}
      </div>
    </div>
  )
}
