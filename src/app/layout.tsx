import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-blue-700 text-white p-4 text-center text-2xl font-bold">
          Portal del Paciente
        </header>

        <main className="p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
