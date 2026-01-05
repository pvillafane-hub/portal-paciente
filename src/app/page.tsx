import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">
        Bienvenido al Portal del Paciente
      </h1>

      <p className="text-xl mb-8">
        Accede a tus documentos médicos de forma segura.
      </p>

      <Link
        href="/dashboard"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-xl"
      >
        Entrar
      </Link>
    </div>
  )
}
