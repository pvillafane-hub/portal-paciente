export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '@/lib/s3'
import { prisma } from '@/lib/prisma'

function MessagePage({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {title}
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed">
          {message}
        </p>

        <div className="mt-6">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Enlace Salud
          </a>
        </div>

      </div>
    </div>
  )
}

export default async function SharedDocumentPage({
  params,
}: {
  params: { token: string }
}) {

  const token = params.token

  // 🔐 Validar formato del token (UUID)
  if (!/^[0-9a-f-]{36}$/.test(token)) {
    return (
      <MessagePage
        title="🔐 Enlace no válido"
        message="El formato del enlace no es válido."
      />
    )
  }

  const share = await prisma.shareLink.findUnique({
    where: { token },
    include: { document: true },
  })

  // 🔐 Token no existe
  if (!share) {
    return (
      <MessagePage
        title="🔐 Enlace no válido"
        message="Este enlace no existe o no está disponible. Verifique que la dirección sea correcta o solicite un nuevo enlace."
      />
    )
  }

  // ⏳ Token expirado
  if (share.expiresAt < new Date()) {
    return (
      <MessagePage
        title="🔒 Este enlace ha expirado"
        message="El acceso a este documento ha expirado por motivos de seguridad. Solicite un nuevo enlace a la persona que lo compartió."
      />
    )
  }

  // 📁 Documento eliminado
  if (!share.document || share.document.deletedAt) {
    return (
      <MessagePage
        title="📄 Documento no disponible"
        message="El documento asociado a este enlace ya no está disponible."
      />
    )
  }

  const key = share.document.filePath

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  })

  // 🔑 Generar Signed URL
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 300, // 5 minutos
  })

  // 🚀 Redirigir al archivo en S3
  redirect(signedUrl)
}