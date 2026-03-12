'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import imageCompression from "browser-image-compression"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// 🔧 función para acortar nombres largos
function formatFileName(name: string) {

  const maxLength = 28

  if (!name) return ""

  if (name.length <= maxLength) {
    return name
  }

  const parts = name.split(".")
  const extension = parts.pop()
  const base = parts.join(".")

  const shortened = base.substring(0, maxLength)

  return `${shortened}...${extension}`
}

export default function UploadPage() {

  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

    if (name === 'docType') {
      if (!value) {
        message = "Seleccione el tipo de documento."
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

    if (selectedFile) {
      formData.set('file', selectedFile)
    }

    const docType = formData.get('docType') as string
    const facility = formData.get('facility') as string
    const studyDate = formData.get('studyDate')

    const newErrors: typeof errors = {}

    if (!selectedFile) {
      newErrors.file = "Por favor, seleccione el documento."
    }

    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      newErrors.file = "El archivo excede el tamaño máximo de 10MB."
    }

    if (!docType) {
      newErrors.docType = "Seleccione el tipo de documento."
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

        setSelectedFile(null)
        setFileName("Ningún archivo seleccionado")

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

  return (

    <div className="max-w-2xl mx-auto">

      <div className="bg-white rounded-2xl p-8 shadow-md">

        <h2 className="text-3xl font-bold mb-4">
          Subir estudio médico
        </h2>

        <p className="text-gray-600 text-lg mb-6">
          Puede subir laboratorios, radiografías o recetas médicas.
        </p>

        {saved && (
          <div className="mb-6 p-6 rounded-xl border border-green-300 bg-green-50 text-green-800 text-lg font-semibold">
            ✔ Estudio guardado correctamente.
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
                  accept="image/*,.pdf"
                  className="hidden"

                  onChange={async (e) => {

                    const file = e.target.files?.[0]

                    if (!file) return

                    let finalFile: File | Blob = file

                    if (file.type.startsWith("image/")) {

                      try {

                        const options = {
                          maxSizeMB: 1,
                          maxWidthOrHeight: 1600,
                          useWebWorker: true,
                        }

                        finalFile = await imageCompression(file, options)

                      } catch (err) {
                        console.error("Compression error:", err)
                      }

                    }

                    let compressedFile = finalFile as File

                    if (!(finalFile instanceof File)) {
                      compressedFile = new File([finalFile], file.name, {
                        type: file.type || "image/jpeg",
                      })
                    }

                    setSelectedFile(compressedFile)
                    setFileName(compressedFile.name)

                    setErrors(prev => ({
                      ...prev,
                      file: undefined
                    }))

                  }}

                />

              </label>

              {/* 🔧 nombre del archivo formateado */}
              <span className="text-gray-600 text-lg truncate max-w-[220px]">
                {formatFileName(fileName)}
              </span>

            </div>

            {errors.file && (
              <p className="mt-2 text-red-700 font-semibold">
                ⚠ {errors.file}
              </p>
            )}

          </label>

          <button
            type="submit"
            disabled={loading}
            className="p-4 rounded-xl text-2xl font-semibold w-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >

            {loading ? 'Guardando...' : 'Guardar estudio médico'}

          </button>

        </form>

      </div>

    </div>
  )
}