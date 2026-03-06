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

  const document = {
    ...doc,
    studyDate: new Date(doc.studyDate).toISOString(),
    createdAt: new Date(doc.createdAt).toISOString(),
  }

  return (
    <ShareClient documents={[document]} />
  )
}