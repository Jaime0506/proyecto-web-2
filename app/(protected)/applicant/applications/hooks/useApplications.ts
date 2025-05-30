import { useState, useEffect } from 'react'
import { applicationService, type Application } from '../services/applicationService'

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationService.getUserApplications()
        setApplications(data)
        setError(null)
      } catch (err) {
        console.error('Error al cargar las postulaciones:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar tus postulaciones')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return 'En revisión'
      case 'APPROVED':
        return 'Aprobada'
      case 'REJECTED':
        return 'Rechazada'
      default:
        return status
    }
  }

  return {
    applications,
    loading,
    error,
    getStatusColor,
    getStatusText
  }
} 