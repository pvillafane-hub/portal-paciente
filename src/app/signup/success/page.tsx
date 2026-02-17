"use client";

import { useRouter } from "next/navigation";
import EntrarFacilButton from "@/components/EntrarFacilButton";

export default function SignupSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-soft p-12 max-w-xl w-full text-center">

        <h1 className="text-4xl font-bold text-green-600 mb-6">
          ✅ Cuenta creada correctamente
        </h1>

        <p className="text-xl text-gray-700 mb-10">
          ¿Quieres activar Entrar Fácil en este dispositivo?
        </p>

        <div className="flex flex-col gap-6">

          <EntrarFacilButton />

          <button
            onClick={() => router.push("/dashboard")}
            className="border border-gray-300 text-gray-700 py-4 rounded-2xl text-xl hover:bg-gray-100 transition"
          >
            Omitir por ahora
          </button>

        </div>

      </div>
    </div>
  );
}
