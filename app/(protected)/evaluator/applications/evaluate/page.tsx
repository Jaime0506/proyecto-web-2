'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Application = {
  id: number
  user_id: string
  call_id: number
  socioeconomic_stratum: number
  icfes_result_num: number
  icfes_result_pdf: string
  stratum_proof_pdf: string
  motivation_letter_pdf: string
  status: string
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  application_scores?: {
    rendimiento_academico: number
    situacion_economica: number
    motivacion: number
    experiencia: number
  }[] | null
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
      if (!error && data) setCalls(data)
    }

    fetchCalls()
  }, [])

  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedCall) return
      setLoading(true)

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          application_scores (
            rendimiento_academico,
            situacion_economica,
            motivacion,
            experiencia
          )
        `)
        .eq('call_id', selectedCall)

      if (!error && data) setApplications(data)
      setLoading(false)
    }

    fetchApplications()
  }, [selectedCall])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Evaluar Postulaciones</h1>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Seleccionar convocatoria:</label>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          value={selectedCall ?? ''}
          onChange={(e) => setSelectedCall(Number(e.target.value))}
        >
          <option value="">-- Selecciona --</option>
          {calls.map((call) => (
            <option key={call.id} value={call.id}>{call.name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Cargando postulaciones...</p>}

      {!loading && selectedCall && applications.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Estrato</th>
                <th className="px-4 py-2 border">Icfes</th>
                <th className="px-4 py-2 border">PDF Icfes</th>
                <th className="px-4 py-2 border">PDF Estrato</th>
                <th className="px-4 py-2 border">Carta</th>
                <th className="px-4 py-2 border">Estado</th>
                <th className="px-4 py-2 border">Revisado por</th>
                <th className="px-4 py-2 border">Fecha revisión</th>
                <th className="px-4 py-2 border">Rendimiento</th>
                <th className="px-4 py-2 border">Economía</th>
                <th className="px-4 py-2 border">Motivación</th>
                <th className="px-4 py-2 border">Experiencia</th>
                <th className="px-4 py-2 border">Total</th>
                <th className="px-4 py-2 border">Promedio</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const s = Array.isArray(app.application_scores) ? app.application_scores[0] : null
                const total = s
                  ? s.rendimiento_academico + s.situacion_economica + s.motivacion + s.experiencia
                  : null
                const promedio = s ? (total! / 4).toFixed(2) : null

                return (
                  <tr key={app.id} className="text-gray-700">
                    <td className="px-4 py-2 border">{app.id}</td>
                    <td className="px-4 py-2 border">{app.user_id}</td>
                    <td className="px-4 py-2 border">{app.socioeconomic_stratum}</td>
                    <td className="px-4 py-2 border">{app.icfes_result_num}</td>
                    <td className="px-4 py-2 border"><a href={app.icfes_result_pdf} target="_blank" className="text-blue-600 underline">📄</a></td>
                    <td className="px-4 py-2 border"><a href={app.stratum_proof_pdf} target="_blank" className="text-blue-600 underline">📄</a></td>
                    <td className="px-4 py-2 border"><a href={app.motivation_letter_pdf} target="_blank" className="text-blue-600 underline">📄</a></td>
                    <td className="px-4 py-2 border">{app.status}</td>
                    <td className="px-4 py-2 border">{app.reviewed_by ?? 'Pendiente'}</td>
                    <td className="px-4 py-2 border">{app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : 'Pendiente'}</td>
                    <td className="px-4 py-2 border">{s ? s.rendimiento_academico : '—'}</td>
                    <td className="px-4 py-2 border">{s ? s.situacion_economica : '—'}</td>
                    <td className="px-4 py-2 border">{s ? s.motivacion : '—'}</td>
                    <td className="px-4 py-2 border">{s ? s.experiencia : '—'}</td>
                    <td className="px-4 py-2 border">{total ?? '—'}</td>
                    <td className="px-4 py-2 border">{promedio ?? '—'}</td>
                    <td className="px-4 py-2 border">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        onClick={() => router.push(`/evaluator/applications/evaluate/${app.id}`)}
                      >
                        Evaluar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && selectedCall && applications.length === 0 && (
        <p className="text-gray-500">No hay postulaciones para esta convocatoria.</p>
      )}
    </div>
  )
}
