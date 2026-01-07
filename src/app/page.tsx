import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="bg-white/90 backdrop-blur rounded-2xl p-10 shadow-soft max-w-xl w-full text-center">
        
        <h1 className="text-4xl font-bold mb-6 text-blue-700">
          Portal del Paciente
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          Accede a tus documentos médicos de forma segura, sencilla
          y confiable desde cualquier lugar.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-4 rounded-xl text-2xl font-semibold hover:bg-blue-700 transition"
          >
            Entrar
          </Link>

          <Link
            href="/signup"
            className="border border-blue-600 text-blue-700 px-6 py-4 rounded-xl text-xl font-semibold hover:bg-blue-50 transition"
          >
            Crear cuenta
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Tus datos están protegidos. Diseñado para pacientes y cuidadores.
        </p>
      </div>
    </div>
  )
}
