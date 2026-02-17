"use client";

import EntrarFacilButton from "@/components/EntrarFacilButton";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-soft p-10">

        <h1 className="text-3xl font-bold mb-8">
          Seguridad
        </h1>

        <div className="space-y-6">

          <div>
            <h2 className="text-xl font-semibold mb-3">
              Entrar Fácil
            </h2>

            <p className="text-gray-600 mb-6">
              Activa el acceso con huella o reconocimiento facial
              en este dispositivo.
            </p>

            <EntrarFacilButton />
          </div>

        </div>

      </div>
    </div>
  );
}
