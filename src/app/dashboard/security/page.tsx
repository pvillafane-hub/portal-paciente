import { getValidatedSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import RegisterPasskeyButton from "@/components/RegisterPasskeyButton"

export default async function SecurityPage() {
  const session = await getValidatedSession()

  // 🔐 Si no hay sesión válida, redirigir
  if (!session) {
    redirect('/?auth=required')
  }

  // 🔎 Verificar si el usuario ya tiene Passkey activada
  const passkey = await prisma.authMethod.findFirst({
    where: { userId: session.userId }
  })

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold mb-6">
        Seguridad de la cuenta
      </h2>

      <div className="bg-white border rounded-xl p-6 space-y-6">

        {/* 🔐 PASSKEY / ENTRAR FÁCIL */}
        <section>
          <h3 className="text-xl font-semibold mb-2">
            Entrar Fácil (Huella / Rostro)
          </h3>

          {passkey ? (
            <div className="bg-green-50 border border-green-300 rounded-xl p-4">
              <p className="text-green-800 font-semibold text-lg">
                ✅ Activado
              </p>

              <p className="text-green-700 mt-2">
                Este dispositivo ya está configurado para entrar con huella o reconocimiento facial.
              </p>

              <button
                disabled
                className="mt-4 bg-gray-200 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
              >
                Ya está configurado
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-300 rounded-xl p-4">
              <p className="text-gray-700 mb-3">
                Active acceso rápido y seguro con su huella o reconocimiento facial.
              </p>

              {/* 👇 AQUÍ USAMOS EL COMPONENTE DIRECTO */}
              <RegisterPasskeyButton />
            </div>
          )}
        </section>

        <hr />

        {/* 🔑 CONTRASEÑA */}
        <section>
          <h3 className="text-xl font-semibold mb-2">
            Contraseña
          </h3>

          <p className="text-gray-600 mb-3">
            Tu contraseña protege el acceso a tu información médica.
          </p>

          <button
            disabled
            className="text-gray-400 underline cursor-not-allowed"
          >
            Cambiar contraseña (próximamente)
          </button>
        </section>

        <hr />

        {/* 🔒 MFA */}
        <section>
          <h3 className="text-xl font-semibold mb-2">
            Verificación en dos pasos (MFA)
          </h3>

          <p className="text-gray-700 mb-2">
            Estado actual:
            <span className="ml-2 font-medium text-red-600">
              No activada
            </span>
          </p>

          <p className="text-gray-600 mb-4">
            La verificación en dos pasos añade una capa adicional de seguridad cuando inicias sesión.
          </p>

          <button
            disabled
            className="bg-gray-200 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
          >
            Activar MFA (próximamente)
          </button>
        </section>

        <hr />

        {/* 📊 ACTIVIDAD */}
        <section>
          <h3 className="text-xl font-semibold mb-2">
            Actividad de la cuenta
          </h3>

          <p className="text-gray-600">
            Próximamente podrás ver un historial de accesos y acciones importantes realizadas en tu cuenta.
          </p>
        </section>

      </div>

      <div className="mt-6">
        <Link
          href="/dashboard"
          className="text-blue-600 underline text-lg"
        >
          ← Volver al dashboard
        </Link>
      </div>
    </div>
  )
}