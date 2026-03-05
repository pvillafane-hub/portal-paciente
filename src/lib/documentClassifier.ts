export function detectDocumentType(text: string): string {

  const t = text.toLowerCase()

  const labKeywords = [
    "hemoglobin",
    "glucose",
    "cholesterol",
    "platelet",
    "cbc",
    "blood",
    "lab results"
  ]

  const imagingKeywords = [
    "radiology",
    "x-ray",
    "mri",
    "ct scan",
    "ultrasound",
    "impression",
    "findings"
  ]

  const prescriptionKeywords = [
    "rx",
    "prescription",
    "medication",
    "take once daily",
    "tablet",
    "capsule"
  ]

  if (labKeywords.some(k => t.includes(k))) {
    return "Laboratorio"
  }

  if (imagingKeywords.some(k => t.includes(k))) {
    return "Radiografia"
  }

  if (prescriptionKeywords.some(k => t.includes(k))) {
    return "Receta"
  }

  return "Otro"
}