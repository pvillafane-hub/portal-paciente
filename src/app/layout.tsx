import './globals.css'
import Link from 'next/link'
import { logout } from '@/app/logout/actions'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">

        {/* HEADER */}
        <header className="bg-white/90 backdrop-blur border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

            {/* LOGO */}
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition"
            >
              Enlace Salud
            </Link>

            {/* NAV */}
            <nav className="flex items-center gap-6 text-lg">

              <Link
                href="/dashboard"
                className="hover:text-blue-600 transition"
              >
                Inicio
              </Link>

              <Link
                href="/view"
                className="hover:text-blue-600 transition"
              >
                Mis documentos
              </Link>

              <Link
                href="/dashboard/security"
                className="hover:text-blue-600 transition"
              >
                Seguridad
              </Link>

              <form action={logout}>
                <button
                  className="text-red-600 hover:underline"
                >
                  Salir
                </button>
              </form>

            </nav>

          </div>
        </header>


        {/* MAIN */}
        <main className="relative">

          {/* BACKGROUND IMAGE */}
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

          <div className="max-w-6xl mx-auto p-8 mt-10">
            {children}
          </div>

        </main>

      </body>
    </html>
  )
}