import Link from 'next/link'

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <ul className="space-y-4 text-xl">
        <li>
          <Link href="/upload" className="text-blue-600 underline">
            📤 Subir Documentos
          </Link>
        </li>
        <li>
          <Link href="/view" className="text-blue-600 underline">
            📂 Ver Documentos
          </Link>
        </li>
        <li>
          <Link href="/share" className="text-blue-600 underline">
            🔗 Compartir
          </Link>
        </li>
      </ul>
    </div>
  )
}
