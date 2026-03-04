'use client'

import './globals.css'
import Link from 'next/link'
import { useState } from 'react'
import { getValidatedSession } from '@/lib/auth'
import { logout } from './logout/actions'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  // ⚠ Si estás usando sesión en layout como server component,
  // debes mover validación a páginas individuales.
  // Aquí dejamos solo visual.

  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">

        {/* HEADER */}
        <header className="bg-white/95 backdrop-blur border-b shadow-sm">
          <div className="max-w-6xl mx-auto p-6 flex justify-between items-center">

            {/* LOGO */}
            <Link href="/" className="text-2xl font-bold text-blue-700">
              🏥 Portal del Paciente
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden md:flex gap-8 text-lg font-medium items-center">
              <Link href="/dashboard" className="hover:text-blue-600 transition">
                Inicio
              </Link>

              <Link href="/view" className="hover:text-blue-600 transition">
                Mis documentos
              </Link>

              <Link href="/dashboard/security" className="hover:text-blue-600 transition">
                Seguridad
              </Link>

              <form action={logout}>
                <button className="text-red-600 hover:underline transition">
                  Salir
                </button>
              </form>
            </nav>

            {/* MOBILE HAMBURGER */}
            <button
              className="md:hidden text-3xl text-blue-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t shadow-md">
              <div className="flex flex-col p-6 space-y-6 text-xl font-semibold">

                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-blue-600"
                >
                  Inicio
                </Link>

                <Link
                  href="/view"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-blue-600"
                >
                  Mis documentos
                </Link>

                <Link
                  href="/dashboard/security"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-blue-600"
                >
                  Seguridad
                </Link>

                <form action={logout}>
                  <button
                    className="text-red-600 text-left"
                    onClick={() => setMenuOpen(false)}
                  >
                    Salir
                  </button>
                </form>

              </div>
            </div>
          )}
        </header>

        {/* MAIN */}
        <main className="relative">
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