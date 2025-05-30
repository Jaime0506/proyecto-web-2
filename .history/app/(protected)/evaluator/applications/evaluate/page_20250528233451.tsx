'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Application = {
  id: number
  full_name: string
  status: string
  icfes_score: number | null
  stratum_score: number | null
  interview_score: number | null
  total_score: number | null
}

type Call = {
  id: number
  name: string
}

export default function EvaluateListPage() {
  const router = useRouter()
  const supabase = createClient()

  const [calls, setCalls] = useState<Call[]>([])
  const [selectedCall, setSelectedCall] = useState<number | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCalls = async () => {
      const { data, error } = await supabase
        .from('scholarship_calls')
        .select('id, name')
      if (error) {
        console.error('Error al obtener convocatorias:', error.message)
        return
      }
      if (data) setCalls(data)
    }

    fetchCalls()
  }, [])

  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedCall) return
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('call_id', selectedCall)

      if (error) {
        console.error('Error al obtener postulaciones:', error.message)
        setLoading(false)
        return
      }

      setApplications(data || [])
      setLoading(false)
    }

    fetchApplications()
  }, [selectedCall])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Evaluar Postulaciones</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Seleccionar convocatoria:</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedCall ?? ''}
          onChange={(e) => setSelectedCall(Number(e.target.value))}
        >
          <option value="">-- Selecciona --</option>
          {calls.map(call => (
            <option key={call.id} value={call.id}>{call.name ?? 'Sin nombre'}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Cargando postulaciones...</p>}

      {!loading && selectedCall && (
        <table className="w-full mt-6 border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">ICFES</th>
              <th className="p-2 border">Estrato</th>
              <th className="p-2 border">Entrevista</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td className="p-2 border">{app.id}</td>
                <td className="p-2 border">{app.full_name}</td>
                <td className="p-2 border">{app.status}</td>
                <td className="p-2 border">{app.icfes_score ?? '—'}</td>
                <td className="p-2 border">{app.stratum_score ?? '—'}</td>
                <td className="p-2 border">{app.interview_score ?? '—'}</td>
                <td className="p-2 border font-semibold">{app.total_score ?? '—'}</td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => router.push(`/evaluator/applications/evaluate/${app.id}`)}
                  >
                    Evaluar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
