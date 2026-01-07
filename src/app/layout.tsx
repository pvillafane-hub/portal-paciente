import './globals.css'
import Link from 'next/link'
import { getSessionUserId } from '@/lib/auth'
import { logout } from './logout/actions'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userId = getSessionUserId()

  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <header className="bg-white border-b">
          <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold">
              🏥 Portal del Paciente
            </Link>

            {userId && (
              <form action={logout}>
                <button className="text-red-600 text-lg underline">
                  Cerrar sesión
                </button>
              </form>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
