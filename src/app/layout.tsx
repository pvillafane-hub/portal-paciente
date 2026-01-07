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
      <body className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">
        
        {/* HEADER */}
        <header className="bg-white/90 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-700">
              🏥 Portal del Paciente
            </h1>

            {userId && (
              <nav className="flex gap-6 text-lg">
                <Link href="/dashboard" className="hover:underline">
                  Inicio
                </Link>
                <Link href="/view" className="hover:underline">
                  Mis documentos
                </Link>
                <form action={logout}>
                  <button className="hover:underline">
                    Salir
                  </button>
                </form>
              </nav>
            )}
          </div>
        </header>

        {/* HERO + CONTENIDO */}
        <main className="relative">
          {/* HERO BACKGROUND */}
          <div className="absolute inset-0 -z-10">
            <div
              className="h-[320px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white" />
          </div>

          {/* PAGE CONTENT */}
          <div className="max-w-6xl mx-auto p-8 mt-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
