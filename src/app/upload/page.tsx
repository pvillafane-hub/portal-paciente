'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'

export default function UploadPage() {

  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [errors, setErrors] = useState<{
    file?: string
    docType?: string
    facility?: string
    studyDate?: string
  }>({})

  const [fileName, setFileName] = useState("Ningún archivo seleccionado")

  const fileRef = useRef<HTMLInputElement>(null)
  const docTypeRef = useRef<HTMLSelectElement>(null)
  const facilityRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  function validateField(name: string, value: any) {

    let message = ''

    if (name === 'file') {
      if (!value || value.size === 0) {
        message = "Por favor, seleccione el documento que desea subir."
      }
    }

    if (name === 'docType') {
      if (!value) {
        message = "Seleccione el tipo de documento."
      }
    }

    if (name === 'facility') {
      if (!value || value.trim() === '') {
        message = "Escriba el nombre del hospital o clínica."
      }
    }

    if (name === 'studyDate') {
      if (!value) {
        message = "Seleccione la fecha en que se realizó el estudio."
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: message || undefined
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault()

    setErrors({})
    setSaved(false)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const file = formData.get('file') as File
    const docType = formData.get('docType') as string
    const facility = formData.get('facility') as string
    const studyDate = formData.get('studyDate')

    const newErrors: typeof errors = {}

    if (!file || file.size === 0) {
      newErrors.file = "Por favor, seleccione el documento que desea subir."
    }

    if (!docType) {
      newErrors.docType = "Seleccione el tipo de documento."
    }

    if (!facility || facility.trim() === "") {
      newErrors.facility = "Escriba el nombre del hospital o clínica."
    }

    if (!studyDate) {
      newErrors.studyDate = "Seleccione la fecha en que se realizó el estudio."
    }

    if (Object.keys(newErrors).length > 0) {

      setErrors(newErrors)
      setLoading(false)

      if (newErrors.file && fileRef.current) {
        fileRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        fileRef.current.focus()
      }

      else if (newErrors.docType && docTypeRef.current) {
        docTypeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        docTypeRef.current.focus()
      }

      else if (newErrors.facility && facilityRef.current) {
        facilityRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        facilityRef.current.focus()
      }

      else if (newErrors.studyDate && dateRef.current) {
        dateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        dateRef.current.focus()
      }

      return
    }

    try {

      const res = await fetch('/api/upload/create', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (res.status === 401) {
        router.push('/?auth=expired')
        return
      }

      if (res.ok) {

        setSaved(true)

        setTimeout(() => {
          router.push('/view')
        }, 2000)

      } else {

        setErrors({
          file: "No se pudo guardar el documento. Intente nuevamente."
        })

      }

    } catch {

      setErrors({
        file: "Ocurrió un problema inesperado. Intente nuevamente."
      })

    }

    setLoading(false)

  }

  const hasErrors = Object.values(errors).some(Boolean)

  return (

    <div className="max-w-2xl mx-auto">

      <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-md">

        <h2 className="text-3xl font-bold mb-4">
          Subir estudio médico
        </h2>

        <p className="text-gray-600 text-lg mb-6">
          Puede subir laboratorios, radiografías, recetas médicas o estudios clínicos.
        </p>

        {/* PASOS PARA PACIENTES */}

        <div className="mb-8 bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-800 text-lg">

          Paso 1: Seleccione su estudio médico  
          <br/>
          Paso 2: Indique el tipo de estudio  
          <br/>
          Paso 3: Indique dónde se realizó  
          <br/>
          Paso 4: Indique la fecha

        </div>

        {saved && (

          <div className="mb-6 p-6 rounded-xl border border-green-300 bg-green-50 text-green-800 text-lg font-semibold animate-fadeIn">

            ✅ Documento guardado correctamente.

          </div>

        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ARCHIVO */}

          <label className="block text-lg font-semibold">

            📄 Archivo

            <div className="mt-3 flex items-center gap-4">

              <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer text-lg">

                Seleccionar documento

                <input
                  ref={fileRef}
                  type="file"
                  name="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {

                    const file = e.target.files?.[0]

                    validateField('file', file)

                    setFileName(file?.name || "Ningún archivo seleccionado")

                  }}
                />

              </label>

              <span className="text-gray-600 text-lg">
                {fileName}
              </span>

            </div>

            {fileName !== "Ningún archivo seleccionado" && (
              <div className="mt-2 text-green-700 font-semibold">
                ✔ Archivo listo para subir
              </div>
            )}

            <p className="text-gray-500 text-lg mt-2">
              Seleccione un documento médico (PDF, JPG o PNG)
            </p>

            {errors.file && (

              <p className="mt-2 text-red-700 font-semibold flex items-center gap-2 animate-fadeIn">
                ⚠ {errors.file}
              </p>

            )}

          </label>

          {/* TIPO */}

          <label className="block text-lg font-semibold">

            🧾 Tipo de estudio

            <select
              ref={docTypeRef}
              name="docType"
              defaultValue="Laboratorios"
              onChange={(e) => validateField('docType', e.target.value)}
              className={`mt-2 w-full p-4 text-lg border rounded-lg transition ${
                errors.docType
                  ? "border-red-600 bg-red-50"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
            >

              <option value="Laboratorios">Laboratorios</option>
              <option value="Rayos X">Rayos X</option>
              <option value="MRI">MRI</option>
              <option value="CT">CT</option>
              <option value="Ultrasonido">Ultrasonido</option>
              <option value="Otro">Otro</option>

            </select>

            {errors.docType && (
              <p className="mt-2 text-red-700 font-semibold flex items-center gap-2 animate-fadeIn">
                ⚠ {errors.docType}
              </p>
            )}

          </label>

          {/* FACILIDAD */}

          <label className="block text-lg font-semibold">

            🏥 Hospital o clínica

            <input
              ref={facilityRef}
              type="text"
              name="facility"
              placeholder="Ej. Hospital Manatí Medical"
              onChange={(e) => validateField('facility', e.target.value)}
              className={`mt-2 w-full p-4 text-lg border rounded-lg transition ${
                errors.facility
                  ? "border-red-600 bg-red-50"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
            />

            {errors.facility && (
              <p className="mt-2 text-red-700 font-semibold flex items-center gap-2 animate-fadeIn">
                ⚠ {errors.facility}
              </p>
            )}

          </label>

          {/* FECHA */}

          <label className="block text-lg font-semibold">

            📅 Fecha del estudio

            <input
              ref={dateRef}
              type="date"
              name="studyDate"
              onChange={(e) => validateField('studyDate', e.target.value)}
              className={`mt-2 w-full p-4 text-lg border rounded-lg transition ${
                errors.studyDate
                  ? "border-red-600 bg-red-50"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500"
              }`}
            />

            {errors.studyDate && (
              <p className="mt-2 text-red-700 font-semibold flex items-center gap-2 animate-fadeIn">
                ⚠ {errors.studyDate}
              </p>
            )}

          </label>

          <button
            type="submit"
            disabled={loading}
            className={`p-4 rounded-xl text-2xl font-semibold w-full transition ${
              hasErrors
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } disabled:opacity-50`}
          >

            {loading ? 'Guardando...' : 'Guardar estudio médico'}

          </button>

          <p className="text-sm text-gray-600 mt-4">
            Todos los campos son obligatorios.
          </p>

        </form>

      </div>

    </div>

  )

}