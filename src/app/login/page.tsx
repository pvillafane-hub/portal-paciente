'use client'

import { useFormState } from 'react-dom'
import { login } from './actions'

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null)

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded-xl border">
      <h2 className="text-3xl font-bold mb-6">Iniciar sesión</h2>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-50 text-red-700 p-3 rounded">
            {state.error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded text-lg"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="w-full border p-3 rounded text-lg"
          required
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded text-lg">
          Entrar
        </button>
      </form>
    </div>
  )
}
