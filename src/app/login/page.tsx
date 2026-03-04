'use client'

import { useFormState } from 'react-dom'
import { login } from './actions'
import { useRef, useEffect, useState } from 'react'

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [clientErrors, setClientErrors] = useState<{
    email?: string
    password?: string
  }>({})

  // 🔎 Si el server devuelve error general, limpiar errores de campo
  useEffect(() => {
    if (state?.error) {
      setClientErrors({})
    }
  }, [state])

  function validateField(name: string, value: string) {
    let message = ''

    if (name === 'email' && !value.trim()) {
      message = 'Escriba su correo electrónico.'
    }

    if (name === 'password' && !value.trim()) {
      message = 'Escriba su contraseña.'
    }

    setClientErrors(prev => ({
      ...prev,
      [name]: message || undefined,
    }))
  }

  function handleClientValidation(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')

    const errors: typeof clientErrors = {}

    if (!email.trim()) {
      errors.email = 'Escriba su correo electrónico.'
    }

    if (!password.trim()) {
      errors.password = 'Escriba su contraseña.'
    }

    if (Object.keys(errors).length > 0) {
      e.preventDefault()
      setClientErrors(errors)

      if (errors.email && emailRef.current) {
        emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        emailRef.current.focus()
      } else if (errors.password && passwordRef.current) {
        passwordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        passwordRef.current.focus()
      }
    }
  }

  const hasErrors =
    state?.error || Object.values(clientErrors).some(Boolean)

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold mb-6">
        Iniciar sesión
      </h2>

      <form
        action={formAction}
        onSubmit={handleClientValidation}
        className="space-y-6"
      >
        {/* 🔴 ERROR GENERAL (credenciales incorrectas) */}
        {state?.error && (
          <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl text-lg font-semibold">
            ⚠ El correo o la contraseña no son correctos. Verifique la información e intente nuevamente.
          </div>
        )}

        {/* EMAIL */}
        <div>
          <label className="block text-lg font-semibold">
            Correo electrónico
          </label>
          <input
            ref={emailRef}
            type="email"
            name="email"
            placeholder="Ej. usuario@email.com"
            onChange={(e) =>
              validateField('email', e.target.value)
            }
            className={`mt-2 w-full p-4 text-lg border rounded-lg focus:ring-2 transition ${
              clientErrors.email
                ? 'border-red-600 bg-red-50 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {clientErrors.email && (
            <p className="mt-2 text-red-700 font-semibold">
              {clientErrors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-lg font-semibold">
            Contraseña
          </label>
          <input
            ref={passwordRef}
            type="password"
            name="password"
            placeholder="Escriba su contraseña"
            onChange={(e) =>
              validateField('password', e.target.value)
            }
            className={`mt-2 w-full p-4 text-lg border rounded-lg focus:ring-2 transition ${
              clientErrors.password
                ? 'border-red-600 bg-red-50 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {clientErrors.password && (
            <p className="mt-2 text-red-700 font-semibold">
              {clientErrors.password}
            </p>
          )}
        </div>

       {/* BOTÓN */}
       <button
         type="submit"
         className={`w-full p-4 rounded-xl text-2xl font-semibold transition ${
          hasErrors
            ? 'bg-red-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700'
         }`}
       >
        Entrar
       </button>

       {/* FORGOT PASSWORD */}
       <p className="text-sm text-gray-600 text-center mt-4">
         ¿Olvidó su contraseña?{' '}
         <a
           href="/forgot-password"
           className="text-blue-600 underline hover:text-blue-700"
         >
          Recuperar acceso
         </a>
      </p>
      </form>
    </div>
  )
}