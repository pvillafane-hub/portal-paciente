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

      {/* DOCUMENTOS */}
      <div className="max-w-5xl mx-auto mt-10">

        <h2 className="text-2xl font-semibold mb-6">
          Tus Documentos
        </h2>

        {user.documents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-soft text-center text-gray-500 text-lg">
            No tienes documentos cargados todavía.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {user.documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-6 shadow-soft space-y-2"
              >
                <h3 className="text-xl font-semibold text-blue-700">
                  {doc.filename}
                </h3>

                <p className="text-gray-600">
                  <strong>Tipo:</strong> {doc.docType}
                </p>

                <p className="text-gray-600">
                  <strong>Institución:</strong> {doc.facility}
                </p>

                <p className="text-gray-600">
                  <strong>Fecha:</strong>{" "}
                  {new Date(doc.studyDate).toLocaleDateString()}
                </p>

                <div className="pt-3">
                  <a
                    href={`/view/${doc.id}`}
                    className="text-blue-600 underline text-lg"
                  >
                    Ver documento
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
