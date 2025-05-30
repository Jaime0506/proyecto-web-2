import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { scholarshipService, type ApplicationForm } from '../services/scholarshipService'

export function useApplicationForm(callId: string) {
  const [formData, setFormData] = useState<ApplicationForm>({
    socioeconomic_stratum: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await scholarshipService.submitApplication(callId, formData)
      alert('¡Aplicación enviada con éxito!')
      router.push('/applicant/convocatorias/active')
    } catch (err) {
      console.error('Error al enviar la aplicación:', err)
      setError(err instanceof Error ? err.message : 'Hubo un error al enviar tu aplicación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const filePath = await scholarshipService.uploadDocument(file, field)
      setFormData(prev => ({
        ...prev,
        [field]: filePath
      }))
    } catch (err) {
      console.error('Error al subir el archivo:', err)
      setError('Error al subir el archivo')
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFormData = (field: keyof ApplicationForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return {
    formData,
    isSubmitting,
    error,
    handleSubmit,
    handleFileUpload,
    updateFormData
  }
} 