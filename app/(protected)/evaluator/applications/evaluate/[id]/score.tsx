'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast, { Toaster } from 'react-hot-toast'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const criterios = [
  { name: 'rendimiento_academico', label: '📚 Rendimiento Académico' },
  { name: 'situacion_economica', label: '💸 Situación Económica' },
  { name: 'motivacion', label: '🔥 Motivación' },
  { name: 'experiencia', label: '🛠️ Experiencia' }
]

export default function ScoringPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({
    rendimiento_academico: null,
    situacion_economica: null,
    motivacion: null,
    experiencia: null,
  })

  useEffect(() => {
    const fetchScores = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('application_scores')
        .select('*')
        .eq('application_id', Number(id))
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error(error)
        toast.error('Error al cargar los puntajes')
      } else if (data) {
        setScores({
          rendimiento_academico: data.rendimiento_academico,
          situacion_economica: data.situacion_economica,
          motivacion: data.motivacion,
          experiencia: data.experiencia
        })
      }

      setLoading(false)
    }

    if (id) fetchScores()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setScores((prev) => ({
      ...prev,
      [name]: Number(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    // Verificar si ya existe
    const { data: existing, error: findError } = await supabase
      .from('application_scores')
      .select('id')
      .eq('application_id', Number(id))
      .single()

    let result
    if (existing) {
      result = await supabase
        .from('application_scores')
        .update({ ...scores })
        .eq('application_id', Number(id))
    } else {
      result = await supabase
        .from('application_scores')
        .insert({ application_id: Number(id), ...scores })
    }

    if (result.error) {
      console.error(result.error)
      toast.error('❌ Error al guardar los puntajes')
    } else {
      toast.success('✅ Puntajes guardados correctamente')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-gray-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        Cargando...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md border">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Asignar Puntajes - Postulación #{id}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {criterios.map(({ name, label }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="number"
              id={name}
              name={name}
              value={scores[name as keyof typeof scores] ?? ''}
              onChange={handleChange}
              min={0}
              max={100}
              required
              className="w-full border p-2 rounded-md"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow"
        >
          Guardar puntajes
        </button>
      </form>
    </div>
  )
}
