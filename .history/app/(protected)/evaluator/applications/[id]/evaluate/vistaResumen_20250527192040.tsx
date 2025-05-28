'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EvaluateApplication() {
  const { id } = useParams()
  const router = useRouter()
  const [icfes, setIcfes] = useState<number | ''>('')
  const [stratum, setStratum] = useState<number | ''>('')
  const [interview, setInterview] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScores = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('applications')
        .select('icfes_score, stratum_score, interview_score')
        .eq('id', Number(id))
        .single()

      if (error) {
        console.error('Error al obtener puntajes:', error)
      } else if (data) {
        setIcfes(data.icfes_score ?? '')
        setStratum(data.stratum_score ?? '')
        setInterview(data.interview_score ?? '')
      }

      setLoading(false)
    }

    if (id) fetchScores()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const icfesScore = Number(icfes) || 0
    const stratumScore = Number(stratum) || 0
    const interviewScore = Number(interview) || 0
    const totalScore = icfesScore + stratumScore + interviewScore

    const { error } = await supabase
      .from('applications')
      .update({
        icfes_score: icfesScore,
        stratum_score: stratumScore,
        interview_score: interviewScore,
        total_score: totalScore
      })
      .eq('id', Number(id))

    if (error) {
      console.error('Error al guardar puntajes:', error)
    } else {
      alert('Puntajes guardados correctamente')
      router.push('/protected/evaluator') // Redirige a la lista si quieres
    }
  }

  if (loading) return <p className="p-4">Cargando...</p>

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Evaluar Postulación #{id}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Puntaje ICFES:</label>
          <input
            type="number"
            value={icfes}
            onChange={(e) => setIcfes(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Puntaje Estrato:</label>
          <input
            type="number"
            value={stratum}
            onChange={(e) => setStratum(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Puntaje Entrevista:</label>
          <input
            type="number"
            value={interview}
            onChange={(e) => setInterview(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar Puntajes
        </button>
      </form>
    </div>
  )
}
