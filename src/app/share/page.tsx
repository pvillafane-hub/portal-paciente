import Select from '@/components/Select'
import Button from '@/components/Button'

export default function SharePage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Compartir</h2>

      <Select
        label="Documento"
        options={[
          { value: '1', label: 'Laboratorio – Hospital A' },
          { value: '2', label: 'Rayos X – Centro B' },
        ]}
      />

      <Select
        label="Expiración"
        options={[
          { value: '24', label: '24 horas' },
          { value: '7', label: '7 días' },
          { value: '30', label: '30 días' },
        ]}
      />

      <Button>Generar enlace (mock)</Button>
    </div>
  )
}
