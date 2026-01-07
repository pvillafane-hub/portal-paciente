import { uploadDocument } from './actions'
import { redirect } from 'next/navigation'
import { getSessionUserId } from '@/lib/auth'


export default function UploadPage() {
  const userId = getSessionUserId()
  if (!userId) redirect('/login')
    
  return (
    <div className="max-w-xl">
      <h2 className="text-3xl font-bold mb-6">Subir Documento Médico</h2>

      <form action={uploadDocument} className="space-y-6">

        {/* ARCHIVO */}
        <label className="block text-xl">
          Archivo
          <input
            type="file"
            name="file"
            accept=".pdf,.jpg,.jpeg,.png"
            required
            className="block mt-2 w-full text-lg"
          />
        </label>

        {/* TIPO DE DOCUMENTO */}
        <label className="block text-xl">
          Tipo de documento
          <select
            name="docType"
            required
            defaultValue="Laboratorios"
            className="block mt-2 w-full text-lg border p-2"
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
        <label className="block text-xl">
          Facilidad / Dónde se realizó
          <input
            type="text"
            name="facility"
            required
            placeholder="Ej. Hospital Manatí Medical"
            className="block mt-2 w-full text-lg border p-2"
          />
        </label>

        {/* FECHA */}
        <label className="block text-xl">
          Fecha del estudio
          <input
            type="date"
            name="studyDate"
            required
            className="block mt-2 w-full text-lg border p-2"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl w-full"
        >
          Guardar Documento
        </button>

      </form>
    </div>
  )
}
