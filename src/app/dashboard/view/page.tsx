'use client'

import { useEffect, useState } from 'react'

type Document = {
  id: string
  filename: string
  filePath: string
  docType: string
  facility: string
  studyDate: string
}

export default function ViewPage() {

  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadDocuments() {

      const res = await fetch('/api/documents/list')

      if (!res.ok) {
        console.error('Error loading documents')
        return
      }

      const data = await res.json()
      setDocuments(data)
      setLoading(false)

    }

    loadDocuments()

  }, [])

  async function handleView(documentId: string) {

    const res = await fetch(`/api/documents/view?id=${documentId}`)

    if (!res.ok) {
      alert('Error cargando documento')
      return
    }

    const data = await res.json()

    window.open(data.url, "_blank")

  }

  return (

    <div>

      <h1>Mis documentos</h1>

      {loading && <p>Cargando...</p>}

      {documents.map(doc => (

        <div key={doc.id}>

          <p>{doc.filename}</p>

          <button onClick={() => handleView(doc.id)}>
            Ver documento
          </button>

        </div>

      ))}

    </div>

  )
}