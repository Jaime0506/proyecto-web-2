'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

type ScholarshipCall = {
  id: number
  name: string
  academic_period: string
  start_date: string
  end_date: string
  description?: string
  guideline_document?: string
}

export default function ActiveCallsPage() {
  const [calls, setCalls] = useState<ScholarshipCall[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalls = async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('scholarship_calls')
        .select('id, name, academic_period, start_date, end_date, description, guideline_document')

      if (error) {
        console.error('Error al obtener convocatorias:', error)
        setLoading(false)
        return
      }

      const now = new Date()

      const activas = (data || []).filter((call) => {
        const start = new Date(call.start_date)
        const end = new Date(call.end_date)
        return now >= start && now <= end
      })

      setCalls(activas)
      setLoading(false)
    }

    fetchCalls()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Convocatorias Activas</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : calls.length === 0 ? (
        <p className="text-center text-gray-600">No hay convocatorias activas.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {calls.map((call) => (
            <div
              key={call.id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{call.name}</h2>
              <p className="text-sm text-gray-600 mb-1">Periodo académico: <strong>{call.academic_period}</strong></p>
              {call.description && <p className="text-gray-700 mb-2">{call.description}</p>}
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-medium">Desde:</span> {new Date(call.start_date).toLocaleDateString()} <br />
                <span className="font-medium">Hasta:</span> {new Date(call.end_date).toLocaleDateString()}
              </p>

              {call.guideline_document && (
                <a
                  href={call.guideline_document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:underline text-sm"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-1" />
                  Ver documento de la convocatoria
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
