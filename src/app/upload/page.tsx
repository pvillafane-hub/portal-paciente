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

  const [docTypeValue, setDocTypeValue] = useState("")
  const [facilityValue, setFacilityValue] = useState("")
  const [dateValue, setDateValue] = useState("")

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
        message = "Seleccione el tipo de estudio."
      }
    }

    if (name === 'facility') {
      if (!value || value.trim() === '') {
        message = "Escriba el hospital o clínica."
      }
    }

    if (name === 'studyDate') {
      if (!value) {
        message = "Seleccione la fecha del estudio."
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
      newErrors.docType = "Seleccione el tipo de estudio."
    }

    if (!facility || facility.trim() === "") {
      newErrors.facility = "Escriba el hospital o clínica."
    }

    if (!studyDate) {
      newErrors.studyDate = "Seleccione la fecha del estudio."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
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
          router.push('/dashboard')
          router.refresh()
        }, 1500)

      } else {

        setErrors({
          file: "No se pudo guardar el documento. Intente nuevamente."
        })

      }

    } catch {

      setErrors({
        file: "Ocurrió un problema inesperado."
      })

    }

    setLoading(false)
  }

  const hasErrors = Object.values(errors).some(Boolean)

  return (

    <div className="max-w-2xl mx-auto">

      <div className="bg-white rounded-2xl p-8 shadow-md">

        <h2 className="text-3xl font-bold mb-4">
          Subir estudio médico
        </h2>

        <p className="text-gray-600 text-lg mb-6">
          Puede subir laboratorios, radiografías o recetas médicas.
        </p>

        {/* PASOS */}

        <div className="mb-8 bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-800">

          Paso 1: Seleccione su estudio médico  
          <br/>
          Paso 2: Indique el tipo de estudio  
          <br/>
          Paso 3: Indique el hospital o clínica  
          <br/>
          Paso 4: Indique la fecha

        </div>

        {/* MENSAJE DE ÉXITO */}

        {saved && (
          <div className="mb-6 p-6 rounded-xl border border-green-300 bg-green-50 text-green-800 text-lg font-semibold">
            ✔ Estudio guardado correctamente.  
            Será redirigido a sus estudios médicos.
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

            <p className="text-gray-500 text-sm mt-2">
              PDF, JPG o PNG
            </p>

            {fileName !== "Ningún archivo seleccionado" && (
              <div className="text-green-700 mt-2 font-semibold">
                ✔ Estudio seleccionado
              </div>
            )}

            {errors.file && (
              <p className="mt-2 text-red-700 font-semibold">
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
              onChange={(e) => {

                setDocTypeValue(e.target.value)
                validateField('docType', e.target.value)

              }}
              className="mt-2 w-full p-4 text-lg border rounded-lg"
            >

              <option value="">Seleccione</option>
              <option value="Laboratorio">Laboratorio</option>
              <option value="Radiografia">Radiografía / Imagen</option>
              <option value="Receta">Receta médica</option>
              <option value="Otro">Otro documento</option>

            </select>

            {docTypeValue && !errors.docType && (
              <div className="text-green-700 mt-2 font-semibold">
                ✔ Tipo de estudio seleccionado
              </div>
            )}

            {errors.docType && (
              <p className="mt-2 text-red-700 font-semibold">
                ⚠ {errors.docType}
              </p>
            )}

          </label>

          {/* HOSPITAL */}

          <label className="block text-lg font-semibold">

            🏥 Hospital o clínica

            <input
              ref={facilityRef}
              type="text"
              name="facility"
              placeholder="Ej. Hospital Manatí Medical"
              onChange={(e) => {

                setFacilityValue(e.target.value)
                validateField('facility', e.target.value)

              }}
              className="mt-2 w-full p-4 text-lg border rounded-lg"
            />

            {facilityValue && !errors.facility && (
              <div className="text-green-700 mt-2 font-semibold">
                ✔ Hospital indicado
              </div>
            )}

            {errors.facility && (
              <p className="mt-2 text-red-700 font-semibold">
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
              onChange={(e) => {

                setDateValue(e.target.value)
                validateField('studyDate', e.target.value)

              }}
              className="mt-2 w-full p-4 text-lg border rounded-lg"
            />

            {dateValue && !errors.studyDate && (
              <div className="text-green-700 mt-2 font-semibold">
                ✔ Fecha seleccionada
              </div>
            )}

            {errors.studyDate && (
              <p className="mt-2 text-red-700 font-semibold">
                ⚠ {errors.studyDate}
              </p>
            )}

          </label>

          {/* BOTÓN */}

          <button
            type="submit"
            disabled={loading}
            className={`p-4 rounded-xl text-2xl font-semibold w-full transition ${
              hasErrors
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >

            {loading ? 'Guardando...' : 'Guardar estudio médico'}

          </button>

        </form>

      </div>

    </div>
  )
}