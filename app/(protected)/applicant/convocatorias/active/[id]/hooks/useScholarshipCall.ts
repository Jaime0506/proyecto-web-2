import { useState, useEffect } from 'react'
import { scholarshipService, type ScholarshipCall } from '../services/scholarshipService'

export function useScholarshipCall(id: string) {
  const [call, setCall] = useState<ScholarshipCall | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCall = async () => {
      try {
        const data = await scholarshipService.getCallById(id)
        setCall(data)
        setError(null)
      } catch (err) {
        console.error('Error al obtener la convocatoria:', err)
        setError('Error al cargar la convocatoria')
      } finally {
        setLoading(false)
      }
    }

    fetchCall()
  }, [id])

  return { call, loading, error }
} 