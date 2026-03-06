export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="max-w-6xl mx-auto p-8">
      {children}
    </main>
  )
}