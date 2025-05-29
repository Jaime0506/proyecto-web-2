'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

type Application = {
  id: number
  user_id: string
  call_id: number
  socioeconomic_status: string
  icfes_results_num: Integer
  icfes_resul_pdf: string
  stratum_proof_pdf: string
  motivation_letter_pdf: string
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
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md border space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Detalles de la Postulación</h1>

      <div className="space-y-3 text-gray-700 text-sm sm:text-base">
        <p><span className="font-semibold">ID:</span> {application.id}</p>
        <p><span className="font-semibold">ID de Usuario:</span> {application.user_id}</p>
        <p><span className="font-semibold">ID de Convocatoria:</span> {application.call_id}</p>
        <p><span className="font-semibold">Nivel socioeconómico:</span> {application.socioeconomic_status}</p>
        <p><span className="font-semibold">Puntaje ICFES:</span> {application.icfes_results_num}</p>

        <p>
          <span className="font-semibold">Resultado ICFES (PDF):</span>{' '}
          <a
            href={application.icfes_resul_pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Ver documento
          </a>
        </p>

        <p>
          <span className="font-semibold">Certificado de estrato (PDF):</span>{' '}
          <a
            href={application.stratum_proof_pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Ver documento
          </a>
        </p>

        <p>
          <span className="font-semibold">Carta de motivación (PDF):</span>{' '}
          <a
            href={application.motivation_letter_pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Ver documento
          </a>
        </p>
      </div>
    </div>
  )
}

