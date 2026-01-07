import { uploadDocument } from './actions'
import { redirect } from 'next/navigation'
import { getSessionUserId } from '@/lib/auth'

export default function UploadPage() {
  const userId = getSessionUserId()
  if (!userId) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-sm">
        
        <h2 className="text-3xl font-bold mb-8">
          Subir Documento Médico
        </h2>

        <form action={uploadDocument} className="space-y-8">

          {/* ARCHIVO */}
          <label className="block text-lg font-semibold">
            Archivo
            <input
              type="file"
              name="file"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              className="mt-2 w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* TIPO DE DOCUMENTO */}
          <label className="block text-lg font-semibold">
            Tipo de documento
            <select
              name="docType"
              required
              defaultValue="Laboratorios"
              className="mt-2 w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Laboratorios">Laboratorios</option>
              <option value="Rayos X">Rayos X</option>
              <option value="MRI">MRI</option>
              <option value="CT">CT</option>
              <option value="Ultrasonido">Ultrasonido</option>
              <option value="Otro">Otro</option>
            </select>
          </label>

          {/* FACILIDAD */}
          <label className="block text-lg font-semibold">
            Facilidad / Dónde se realizó
            <input
              type="text"
              name="facility"
              required
              placeholder="Ej. Hospital Manatí Medical"
              className="mt-2 w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* FECHA */}
          <label className="block text-lg font-semibold">
            Fecha del estudio
            <input
              type="date"
              name="studyDate"
              required
              className="mt-2 w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white p-4 rounded-xl text-2xl font-semibold w-full hover:bg-blue-700 transition"
          >
            Guardar Documento
          </button>

        </form>
      </div>
    </div>
  )
}
