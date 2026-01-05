import { getDocuments } from './actions'
import { unstable_noStore as noStore } from 'next/cache'

export default async function ViewPage() {
  noStore()
  const docs = await getDocuments()

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Ver Documentos</h2>

      <ul className="space-y-4 text-xl">
        {docs.map(doc => (
          <li key={doc.id}>
            <a
              href={doc.filePath}
              target="_blank"
              className="text-blue-600 underline"
            >
              {doc.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
