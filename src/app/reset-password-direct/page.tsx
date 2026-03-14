'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ResetPasswordDirectPage() {

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault()
    setMessage('')

    if (password.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (password !== confirm) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/reset-direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      setMessage('Contraseña actualizada correctamente.')
    } else {
      setMessage('Error actualizando contraseña.')
    }

    setLoading(false)
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Crear nueva contraseña
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Introduce una nueva contraseña segura para continuar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
          >
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-center text-red-600">
            {message}
          </p>
        )}

        {/* SALIR / CANCELAR */}

        <div className="mt-6 text-center">

          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Cancelar y volver
          </Link>

        </div>

      </div>

    </div>
  )
}