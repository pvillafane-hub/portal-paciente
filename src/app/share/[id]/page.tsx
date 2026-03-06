import { prisma } from "@/lib/prisma"
import ShareClient from "../share-client"

export default async function ShareDocumentPage({
  params,
}: {
  params: { id: string }
}) {

  const doc = await prisma.document.findUnique({
    where: { id: params.id },
  })

  if (!doc) {
    return (
      <div className="p-10 text-center">
        Documento no encontrado
      </div>
    )
  }

  // Convertir fechas para evitar errores en React Client Components
  const document = {
    ...doc,
    studyDate: new Date(doc.studyDate),
    createdAt: new Date(doc.createdAt),
  }

  return (
    <ShareClient documents={[document]} />
  )
}