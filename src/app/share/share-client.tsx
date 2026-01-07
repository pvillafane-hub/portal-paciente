'use client'

import { useState } from 'react'
import { createShareLink } from './actions'

type Document = {
  id: string
  filename: string
  docType: string
  facility: string
  studyDate: Date
}

export default function ShareClient({
  documents,
}: {
  documents: Document[]
}) {
  const [link, setLink] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await createShareLink(null, formData)
    if (result?.token) {
      setLink(`${window.location.origin}/s/${result.token}`)
    }
  }

  return (
    <div>
      <form action={handleSubmit} className="space-y-8">

        {/* DOCUMENTO */}
        <label className="block text-lg font-semibold">
          Documento a compartir
          <select
            name="documentId"
            required
            className="mt-2 w-full p-4 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un documento</option>
            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.filename} · {doc.docType} ·{' '}
                {new Date(doc.studyDate).toLocaleDateString('es-PR')}
              </option>
            ))}
          </select>
        </label>

        {/* EXPIRACIÓN */}
        <label className="block text-lg font-semibold">
          Expiración del enlace
          <select
            name="days"
            defaultValue="7"
            className="mt-2 w-full p-4 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">24 horas</option>
            <option value="7">7 días</option>
            <option value="30">30 días</option>
          </select>
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white p-4 rounded-xl text-2xl font-semibold w-full hover:bg-green-700 transition"
        >
          Generar enlace
        </button>
      </form>

      {link && (
        <div className="mt-8 bg-green-50 border border-green-200 p-4 rounded-xl">
          <p className="font-semibold text-lg mb-2">
            Enlace generado:
          </p>

          <div className="flex gap-2">
            <input
              value={link}
              readOnly
              className="w-full p-3 border rounded-lg text-lg"
            />

            <button
              onClick={() => navigator.clipboard.writeText(link)}
              className="bg-blue-600 text-white px-4 rounded-lg text-lg hover:bg-blue-700"
            >
              Copiar
            </button>
          </div>

          <p className="text-gray-600 mt-2">
            Comparte este enlace con tu médico o familiar.
          </p>
        </div>
      )}
    </div>
  )
}
