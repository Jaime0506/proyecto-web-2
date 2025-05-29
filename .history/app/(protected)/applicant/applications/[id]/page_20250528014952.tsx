'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

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
        .eq('id', Number(id))
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-gray-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        Cargando...
      </div>
    )
  }

  if (!application) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md border text-center text-red-600 font-medium">
        No se encontró la postulación.
      </div>
    )
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md border space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Detalles de la Postulación</h1>

      <div className="space-y-2 text-gray-700">
        <p><span className="font-semibold">ID:</span> {application.id}</p>
        <p><span className="font-semibold">Nombre completo:</span> {application.full_name}</p>

        {application.document_url && (
          <p>
            <span className="font-semibold">Documento:</span>{' '}
            <a
              href={application.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Ver documento
            </a>
          </p>
        )}

        <p>
          <span className="font-semibold">Fecha de registro:</span>{' '}
          {new Date(application.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
