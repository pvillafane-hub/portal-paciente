import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionUserId } from '@/lib/auth'

export default function Dashboard() {
  const userId = getSessionUserId()
  if (!userId) redirect('/login')

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">
        Bienvenido a tu Portal
      </h2>
      <div className="mt-8">
        <Link
          href="/security"
          className="text-blue-600 underline text-lg"
        >
          🔐 Seguridad de la cuenta
        </Link>
     </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/upload" className="card">
          📤 Subir Documentos
        </Link>

        <Link href="/view" className="card">
          📂 Ver Documentos
        </Link>

        <Link href="/share" className="card">
          🔗 Compartir
        </Link>
      </div>
    </div>
  )
}
