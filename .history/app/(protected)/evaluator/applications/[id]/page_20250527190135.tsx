'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EvaluateApplicationPage() {
  const { id } = useParams()
  const router = useRouter()
  const [icfes, setIcfes] = useState<number>(0)
  const [stratum, setStratum] = useState<number>(0)
  const [interview, setInterview] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const total = icfes + stratum + interview
    const supabase = createClient()

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

    setLoading(false)

    if (error) {
      console.error(error)
      setError('Error al guardar la evaluación')
    } else {
      router.push(`/evaluador/applications/${id}`)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Evaluar Postulación #{id}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Puntaje ICFES (0-400):</label>
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
          <label className="block mb-1 font-medium">Puntaje Estrato (0-100):</label>
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
          <label className="block mb-1 font-medium">Puntaje Entrevista (0-100):</label>
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
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Guardando...' : 'Guardar evaluación'}
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  )
}
