'use client'

import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">

        <main className="relative">

          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0 -z-10">
            <div
              className="h-[320px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white" />
          </div>

          <div className="max-w-6xl mx-auto p-8 mt-10">
            {children}
          </div>

        </main>

      </body>
    </html>
  )
}