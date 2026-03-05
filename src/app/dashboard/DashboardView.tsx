import EntrarFacilButton from "@/components/EntrarFacilButton";

interface Document {
  id: string;
  filename: string;
  docType: string;
  facility: string;
  studyDate: Date;
  createdAt: Date;
}

interface DashboardViewProps {
  user: {
    id: string;
    email: string;
    fullName: string;
    createdAt: Date;
    documents: Document[];
  };
}

export default function DashboardView({ user }: DashboardViewProps) {

  // Ordenar documentos por fecha más reciente
  const sortedDocuments = [...user.documents].sort(
    (a, b) => new Date(b.studyDate).getTime() - new Date(a.studyDate).getTime()
  );

  // Último estudio
  const latestDocument = sortedDocuments[0];

  function getIcon(type: string) {
    const t = type.toLowerCase();

    if (t.includes("laboratorio")) return "🧪";
    if (t.includes("radi")) return "🩻";
    if (t.includes("receta")) return "💊";

    return "📄";
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-soft p-10">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
              Bienvenido, {user.fullName}
            </h1>

            <p className="text-gray-600 mt-2 text-lg">
              {user.email}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Miembro desde {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <a
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl text-xl font-semibold transition text-center"
          >
            + Subir documento
          </a>
        </div>

        {/* ENTRAR FÁCIL */}
        <div className="mt-10">
          <EntrarFacilButton />
        </div>

      </div>


      {/* ÚLTIMO ESTUDIO DESTACADO */}
      {latestDocument && (
        <div className="max-w-5xl mx-auto mt-10 bg-white rounded-3xl shadow-soft p-8 border-l-8 border-blue-600">

          <h2 className="text-2xl font-bold mb-4">
            Tu último estudio médico
          </h2>

          <h3 className="text-xl font-semibold text-blue-700">
            {getIcon(latestDocument.docType)} {latestDocument.docType}
          </h3>

          <p className="text-gray-600">
            <strong>Institución:</strong> {latestDocument.facility}
          </p>

          <p className="text-gray-600">
            <strong>Fecha:</strong>{" "}
            {new Date(latestDocument.studyDate).toLocaleDateString()}
          </p>

          <div className="pt-4 flex gap-3 flex-wrap">

            <a
              href={`/view/${latestDocument.id}`}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg text-lg"
            >
              Ver estudio
            </a>

            <a
              href={`/share/${latestDocument.id}`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-lg"
            >
              Enviar a mi médico
            </a>

          </div>

        </div>
      )}


      {/* HISTORIAL DE DOCUMENTOS */}
      <div className="max-w-5xl mx-auto mt-10">

        <h2 className="text-2xl font-semibold">
          Historial de estudios médicos
        </h2>

        <p className="text-gray-600 mb-6 text-lg">
          Aquí puedes ver y compartir tus estudios médicos.
        </p>

        {sortedDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-soft text-center text-gray-500 text-lg">
            No tienes documentos cargados todavía.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {sortedDocuments.map((doc) => (

              <div
                key={doc.id}
                className="bg-white rounded-2xl p-6 shadow-soft space-y-2"
              >

                <h3 className="text-xl font-semibold text-blue-700">
                  {getIcon(doc.docType)} {doc.docType}
                </h3>

                <p className="text-gray-600">
                  <strong>Institución:</strong> {doc.facility}
                </p>

                <p className="text-gray-600">
                  <strong>Fecha:</strong>{" "}
                  {new Date(doc.studyDate).toLocaleDateString()}
                </p>

                <div className="pt-4 flex flex-wrap gap-3">

                  <a
                    href={`/view/${doc.id}`}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg text-lg"
                  >
                    Ver estudio
                  </a>

                  <a
                    href={`/share/${doc.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-lg"
                  >
                    Enviar a mi médico
                  </a>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}