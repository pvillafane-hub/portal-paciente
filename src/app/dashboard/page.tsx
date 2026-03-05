import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto mt-14">

      <h2 className="text-2xl font-semibold mb-2">
        Acciones rápidas
      </h2>

      <p className="text-gray-600 text-lg mb-8">
        Usa estas opciones para gestionar tus estudios médicos.
      </p>

      <div className="grid gap-6 md:grid-cols-2">

        <DashboardCard
          href="/upload"
          icon="📤"
          title="Subir estudio médico"
          description="Laboratorios, radiografías o estudios clínicos"
        />

        <DashboardCard
          href="/share"
          icon="👨‍⚕️"
          title="Enviar estudio a mi médico"
          description="Comparte tus estudios con tu doctor o familiar"
        />

      </div>

    </div>
  );
}

function DashboardCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border rounded-3xl p-8 hover:shadow-lg transition text-center block"
    >

      <div className="text-5xl mb-4">{icon}</div>

      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-600 text-lg">
        {description}
      </p>

    </Link>
  );
}