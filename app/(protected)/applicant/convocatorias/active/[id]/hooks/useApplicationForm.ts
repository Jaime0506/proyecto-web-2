import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { scholarshipService, type ApplicationForm } from '../services/scholarshipService'

export function useApplicationForm(callId: string) {
  const [formData, setFormData] = useState<ApplicationForm>({
    socioeconomic_stratum: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkApplication = async () => {
      try {
        const hasApplied = await scholarshipService.hasAlreadyApplied(callId)
        setHasAlreadyApplied(hasApplied)
        if (hasApplied) {
          setError('Ya has postulado a esta convocatoria')
        }
      } catch (err) {
        console.error('Error al verificar la aplicación:', err)
        setError(err instanceof Error ? err.message : 'Error al verificar tu aplicación')
      }
    }

    checkApplication()
  }, [callId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasAlreadyApplied) return

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
    hasAlreadyApplied,
    handleSubmit,
    handleFileUpload,
    updateFormData
  }
} 