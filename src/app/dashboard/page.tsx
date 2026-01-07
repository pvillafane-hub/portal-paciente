import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="grid gap-8 md:grid-cols-3 mt-10">
      <DashboardCard
        href="/upload"
        title="📤 Subir documentos"
        description="Laboratorios, rayos X, estudios médicos"
      />

      <DashboardCard
        href="/view"
        title="📂 Ver documentos"
        description="Revisa tus archivos médicos"
      />

      <DashboardCard
        href="/share"
        title="🔗 Compartir"
        description="Comparte con tu médico o familiar"
      />
    </div>
  )
}

function DashboardCard({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="bg-white/90 backdrop-blur border rounded-2xl p-8 text-center hover:shadow-lg transition"
    >
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 text-lg">{description}</p>
    </Link>
  )
}
