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

export default function ClassifyAndScoreApplicationPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('IN_REVIEW')
  const [userId, setUserId] = useState('')
  const [scores, setScores] = useState({
    rendimiento_academico: null,
    situacion_economica: null,
    motivacion: null,
    experiencia: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Traer estado y user_id
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('status, user_id')
        .eq('id', Number(id))
        .single()

      if (appError) {
        console.error('Error al obtener el estado:', appError)
        toast.error('Error al cargar datos de la postulación')
      } else if (appData) {
        setStatus(appData.status || 'IN_REVIEW')
        setUserId(appData.user_id)
      }

      // Traer puntajes si existen
      const { data: scoreData, error: scoreError } = await supabase
        .from('application_scores')
        .select('*')
        .eq('application_id', Number(id))
        .single()

      if (scoreError && scoreError.code !== 'PGRST116') {
        console.error('Error al cargar puntajes:', scoreError)
        toast.error('Error al cargar los puntajes')
      } else if (scoreData) {
        setScores({
          rendimiento_academico: scoreData.rendimiento_academico,
          situacion_economica: scoreData.situacion_economica,
          motivacion: scoreData.motivacion,
          experiencia: scoreData.experiencia
        })
      }

      setLoading(false)
    }

    if (id) fetchData()
  }, [id])

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setScores((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    // Guardar estado
    const { error: statusError } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', Number(id))

    if (statusError) {
      console.error('Error al actualizar estado:', statusError)
      toast.error('Error al guardar el estado')
    } else {
      toast.success('Estado guardado', { icon: '✅' })
    }

    // Guardar puntajes
    const { data: existingScore } = await supabase
      .from('application_scores')
      .select('id')
      .eq('application_id', Number(id))
      .single()

    let scoreResult
    if (existingScore) {
      scoreResult = await supabase
        .from('application_scores')
        .update({ ...scores })
        .eq('application_id', Number(id))
    } else {
      scoreResult = await supabase
        .from('application_scores')
        .insert({ application_id: Number(id), ...scores })
    }

    if (scoreResult.error) {
      console.error(scoreResult.error)
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
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Postulación #{id}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Usuario: <strong>{userId?.slice(0, 8)}...</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Estado de la postulación
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="APPROVED">Aprobada</option>
            <option value="REJECTED">Rechazada</option>
            <option value="IN_REVIEW">En revisión</option>
            <option value="PENDING">Pendiente</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4">
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
                onChange={handleScoreChange}
                min={0}
                max={100}
                required
                className="w-full border p-2 rounded-md"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow"
        >
          Guardar todo
        </button>
      </form>
    </div>
  )
}
