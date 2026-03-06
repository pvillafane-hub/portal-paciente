'use client'

import { useState } from "react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [menuOpen, setMenuOpen] = useState(false)

  return (

    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}

      <nav className="bg-white border-b">

        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}

          <Link href="/dashboard" className="text-xl font-bold">
            Portal del Paciente
          </Link>

          {/* MENU DESKTOP */}

          <div className="hidden md:flex items-center gap-6 text-lg">

            <Link href="/dashboard">
              Dashboard
            </Link>

            <Link href="/upload">
              Subir estudio
            </Link>

            <Link href="/security">
              Seguridad
            </Link>

          </div>

          {/* HAMBURGER MOBILE */}

          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>

      </nav>

      {/* MOBILE MENU */}

      {menuOpen && (

        <div className="md:hidden bg-white border-b">

          <div className="flex flex-col gap-4 p-6 text-lg">

            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>

            <Link href="/upload" onClick={() => setMenuOpen(false)}>
              Subir estudio
            </Link>

            <Link href="/security" onClick={() => setMenuOpen(false)}>
              Seguridad
            </Link>

          </div>

        </div>

      )}

      {/* CONTENT */}

      <main className="max-w-6xl mx-auto p-8">
        {children}
      </main>

    </div>

  )
}