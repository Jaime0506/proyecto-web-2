'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
      // Simular un pequeño delay como si estuviera cargando desde la base de datos
      await new Promise((res) => setTimeout(res, 500))
  
      // Datos quemados (mock)
      const mockData: ScholarshipCall[] = [
        {
          id: 1,
          name: 'Beca Excelencia Académica',
          academic_period: '2025-1',
          start_date: '2025-05-01',
          end_date: '2025-06-30',
          description: 'Apoyo económico para estudiantes con excelente rendimiento académico.',
        },
        {
          id: 2,
          name: 'Beca Deportiva',
          academic_period: '2025-1',
          start_date: '2025-04-15',
          end_date: '2025-05-31',
          description: 'Convocatoria para estudiantes destacados en deportes.',
        },
        {
          id: 3,
          name: 'Beca de Investigación',
          academic_period: '2025-1',
          start_date: '2025-01-01',
          end_date: '2025-02-28',
          description: 'Ya vencida (para prueba).',
        },
      ]
  
      const now = new Date()
  
      const activas = mockData.filter((call) => {
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
