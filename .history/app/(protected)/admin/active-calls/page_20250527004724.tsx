'use client'

import { useEffect, useState } from 'react'

type ScholarshipCall = {
  id: number
  name: string
  academic_period: string
  start_date: string
  end_date: string
  description?: string
}

export default function ActiveCallsPage() {
  const [calls, setCalls] = useState<ScholarshipCall[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalls = async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('scholarship_calls')
        .select('id, name, academic_period, start_date, end_date, description')

      if (error) {
        console.error('Error al obtener convocatorias:', error)
        return
      }

      const now = new Date()

      const activas = (data || []).filter((call: ScholarshipCall) => {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Convocatorias Activas</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : calls.length === 0 ? (
        <p>No hay convocatorias activas.</p>
      ) : (
        <ul className="space-y-4">
          {calls.map((call) => (
            <li key={call.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{call.name}</h2>
              <p className="text-gray-600 mb-1">Periodo académico: {call.academic_period}</p>
              {call.description && <p className="mb-1">{call.description}</p>}
              <p className="text-sm text-gray-500">
                Desde: {new Date(call.start_date).toLocaleDateString()} — Hasta: {new Date(call.end_date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
