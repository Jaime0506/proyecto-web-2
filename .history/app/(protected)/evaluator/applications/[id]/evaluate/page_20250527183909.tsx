'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EvaluateApplicationPage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState({
    icfes_score: 0,
    stratum_score: 0,
    interview_score: 0,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    // Obtener usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const total_score = form.icfes_score + form.stratum_score + form.interview_score

    const { error } = await supabase
      .from('applications')
      .update({
        ...form,
        total_score,
        status: 'evaluated', // opcional: actualizar estado
        reviewed_by: user?.id || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', Number(id))

    setLoading(false)

    if (error) {
      alert('Error al guardar la evaluación')
      console.error(error)
    } else {
      alert('Evaluación guardada correctamente')
      router.push(`/evaluador/applications/${id}`)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Evaluar postulación #{id}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium" htmlFor="icfes_score">Puntaje ICFES (0–10)</label>
          <input
            id="icfes_score"
            type="number"
            name="icfes_score"
            min={0}
            max={10}
            value={form.icfes_score}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium" htmlFor="stratum_score">Puntaje Estrato (0–5)</label>
          <input
            id="stratum_score"
            type="number"
            name="stratum_score"
            min={0}
            max={5}
            value={form.stratum_score}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium" htmlFor="interview_score">Puntaje Entrevista (0–15)</label>
          <input
            id="interview_score"
            type="number"
            name="interview_score"
            min={0}
            max={15}
            value={form.interview_score}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Guardando...' : 'Guardar evaluación'}
        </button>
      </form>
    </div>
  )
}
