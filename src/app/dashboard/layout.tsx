'use client'

import Link from 'next/link'
import { useState } from 'react'
import { logout } from '@/app/logout/actions'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur border-b shadow-sm">

        <div className="max-w-6xl mx-auto p-6 flex justify-between items-center">

          {/* LOGO */}
          <Link href="/dashboard" className="text-2xl font-bold text-blue-700">
            🩺 Enlace Salud
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex gap-8 text-lg font-medium items-center">

            <Link href="/dashboard" className="hover:text-blue-600 transition">
              Inicio
            </Link>

            <Link href="/view" className="hover:text-blue-600 transition">
              Mis documentos
            </Link>

            <Link
              href="/dashboard/security"
              className="hover:text-blue-600 transition"
            >
              Seguridad
            </Link>

            <form action={logout}>
              <button className="text-red-600 hover:underline transition">
                Salir
              </button>
            </form>

          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-3xl text-blue-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            ☰
          </button>

        </div>

        {/* MOBILE MENU */}
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

      {/* PAGE CONTENT */}
      <main className="max-w-6xl mx-auto p-8">
        {children}
      </main>
    </>
  )
}