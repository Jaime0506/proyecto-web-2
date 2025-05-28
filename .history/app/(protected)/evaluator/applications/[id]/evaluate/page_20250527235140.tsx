'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function EvaluateApplicationPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [icfes, setIcfes] = useState<number>(0)
  const [stratum, setStratum] = useState<number>(0)
  const [interview, setInterview] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)

  // Cargar datos de la postulación
  useEffect(() => {
    const fetchApplication = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('id, full_name, status, icfes_score, stratum_score, interview_score, total_score')
        .eq('id', Number(id))
        .single()

      if (error) {
        console.error('Error al cargar postulación:', error)
        setError('No se pudo cargar la postulación.')
      } else {
        setApplication(data)
        setIcfes(data.icfes_score ?? 0)
        setStratum(data.stratum_score ?? 0)
        setInterview(data.interview_score ?? 0)
      }

      setLoading(false)
    }

    fetchApplication()
  }, [id, supabase])

  // Guardar evaluación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const total = icfes + stratum + interview

    const { error } = await supabase
      .from('applications')
      .update({
        icfes_score: icfes,
        stratum_score: stratum,
        interview_score: interview,
        total_score: total,
        status: 'evaluated'
      })
      .eq('id', Number(id))

    setSubmitting(false)

    if (error) {
      console.error(error)
      setError('Error al guardar la evaluación.')
    } else {
      router.push('/evaluator/applications')
    }
  }

  if (loading) return <p className="p-6">Cargando...</p>
  if (!application) return <p className="p-6 text-red-600">{error || 'No se encontró la postulación.'}</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Evaluar Postulación #{application.id}</h1>

      <div className="mb-6 border p-4 rounded bg-gray-50">
        <p><strong>Nombre del postulante:</strong> {application.full_name}</p>
        <p><strong>Estado actual:</strong> {application.status}</p>
        {application.total_score !== null && (
          <p><strong>Puntaje total previo:</strong> {application.total_score}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Puntaje ICFES (0–400):</label>
          <input
            type="number"
            value={icfes}
            onChange={(e) => setIcfes(Number(e.target.value))}
            className="w-full border p-2 rounded"
            required
            min={0}
            max={400}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Puntaje Estrato (0–100):</label>
          <input
            type="number"
            value={stratum}
            onChange={(e) => setStratum(Number(e.target.value))}
            className="w-full border p-2 rounded"
            required
            min={0}
            max={100}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Puntaje Entrevista (0–100):</label>
          <input
            type="number"
            value={interview}
            onChange={(e) => setInterview(Number(e.target.value))}
            className="w-full border p-2 rounded"
            required
            min={0}
            max={100}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {submitting ? 'Guardando...' : 'Guardar evaluación'}
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  )
}
