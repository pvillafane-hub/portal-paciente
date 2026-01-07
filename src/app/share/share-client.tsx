'use client'

import { useFormState } from 'react-dom'
import { createShareLink } from './actions'

export default function ShareClient({
  documents,
}: {
  documents: any[]
}) {
  const [state, formAction] = useFormState(createShareLink, null)

  return (
    <div className="space-y-6 max-w-xl">
      <form action={formAction} className="space-y-4 bg-white border p-6 rounded-xl">
        <label className="block text-lg font-medium">
          Documento
          <select
            name="documentId"
            required
            className="block w-full border p-2 mt-2"
          >
            <option value="">Seleccione un documento</option>
            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.filename}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-lg font-medium">
          Expiración
          <select
            name="days"
            className="block w-full border p-2 mt-2"
          >
            <option value="1">24 horas</option>
            <option value="7">7 días</option>
            <option value="30">30 días</option>
          </select>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded text-lg"
        >
          Generar enlace
        </button>
      </form>

      {state?.token && (
        <div className="bg-green-50 p-4 rounded border">
          <p className="font-medium mb-2">Enlace generado:</p>
          <input
            value={`${window.location.origin}/s/${state.token}`}
            readOnly
            className="w-full border p-2"
            onClick={e => e.currentTarget.select()}
          />
        </div>
      )}

      {state?.error && (
        <div className="bg-red-50 text-red-700 p-3 rounded">
          {state.error}
        </div>
      )}
    </div>
  )
}
