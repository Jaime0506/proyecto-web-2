'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Application = {
  id: number
  full_name: string
  document_url?: string
  created_at: string
}

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplication = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', Number(id)) // conversión aquí
        .single()

      if (error) {
        console.error('Error al obtener la postulación:', error)
      } else {
        setApplication(data)
      }

      setLoading(false)
    }

    if (id) fetchApplication()
  }, [id])

  if (loading) return <p>Cargando...</p>
  if (!application) return <p>No se encontró la postulación.</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalles de la Postulación</h1>
      <p><strong>ID:</strong> {application.id}</p>
      <p><strong>Nombre completo:</strong> {application.full_name}</p>
      {application.document_url && (
        <p>
          <strong>Documento:</strong>{' '}
          <a href={application.document_url} target="_blank" className="text-blue-600 underline">
            Ver documento
          </a>
        </p>
      )}
      <p><strong>Fecha de registro:</strong> {new Date(application.created_at).toLocaleString()}</p>
    </div>
  )
}
