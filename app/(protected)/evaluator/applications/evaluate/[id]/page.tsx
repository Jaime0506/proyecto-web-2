'use client' // Indica que este componente se ejecuta en el cliente (cliente-side rendering)

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation' // Para acceder a parámetros de la URL
import { createClient } from '@/lib/supabase/client' // Cliente de Supabase para acceder a la base de datos
import toast, { Toaster } from 'react-hot-toast' // Para mostrar notificaciones
import { ArrowPathIcon } from '@heroicons/react/24/outline' // Ícono de carga

// Lista de criterios que se van a calificar
const criterios = [
  { name: 'rendimiento_academico', label: '📚 Rendimiento Académico' },
  { name: 'situacion_economica', label: '💸 Situación Económica' },
  { name: 'motivacion', label: '🔥 Motivación' },
  { name: 'experiencia', label: '🛠️ Experiencia' }
]

export default function ClassifyAndScoreApplicationPage() {
  const { id } = useParams() // Obtiene el ID de la postulación desde la URL
  const [loading, setLoading] = useState(true) // Controla el estado de carga
  const [status, setStatus] = useState('IN_REVIEW') // Estado actual de la postulación
  const [userId, setUserId] = useState('') // ID del usuario que realizó la postulación
  const [scores, setScores] = useState({
    rendimiento_academico: null,
    situacion_economica: null,
    motivacion: null,
    experiencia: null,
  }) // Estado de los puntajes

  // Efecto que se ejecuta al cargar la página para traer datos de la postulación
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Obtener estado y usuario de la postulación
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('status, user_id')
        .eq('id', Number(id))
        .single()

      // Manejo de error al obtener aplicación
      if (appError) {
        console.error('Error al obtener el estado:', appError)
        toast.error('Error al cargar datos de la postulación')
      } else if (appData) {
        // Guardar estado y user_id
        setStatus(appData.status || 'IN_REVIEW')
        setUserId(appData.user_id)
      }

      // Obtener los puntajes si ya existen
      const { data: scoreData, error: scoreError } = await supabase
        .from('application_scores')
        .select('*')
        .eq('application_id', Number(id))
        .single()

      // Manejo de error al obtener puntajes
      if (scoreError && scoreError.code !== 'PGRST116') {
        console.error('Error al cargar puntajes:', scoreError)
        toast.error('Error al cargar los puntajes')
      } else if (scoreData) {
        // Cargar puntajes en el estado
        setScores({
          rendimiento_academico: scoreData.rendimiento_academico,
          situacion_economica: scoreData.situacion_economica,
          motivacion: scoreData.motivacion,
          experiencia: scoreData.experiencia
        })
      }

      setLoading(false) // Finaliza la carga
    }

    if (id) fetchData() // Ejecuta la función si hay ID
  }, [id])

  // Maneja cambios en los inputs de puntaje
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setScores((prev) => ({ ...prev, [name]: Number(value) }))
  }

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    // Actualizar el estado de la postulación
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

    // Verificar si ya hay puntajes guardados para esta postulación
    const { data: existingScore } = await supabase
      .from('application_scores')
      .select('id')
      .eq('application_id', Number(id))
      .single()

    let scoreResult
    if (existingScore) {
      // Si existe, actualizar
      scoreResult = await supabase
        .from('application_scores')
        .update({ ...scores })
        .eq('application_id', Number(id))
    } else {
      // Si no existe, insertar nuevos puntajes
      scoreResult = await supabase
        .from('application_scores')
        .insert({ application_id: Number(id), ...scores })
    }

    // Mostrar resultado
    if (scoreResult.error) {
      console.error(scoreResult.error)
      toast.error('❌ Error al guardar los puntajes')
    } else {
      toast.success('✅ Puntajes guardados correctamente')
    }
  }

  // Mostrar pantalla de carga mientras se obtiene la información
  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-gray-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        Cargando...
      </div>
    )
  }

  // Renderiza el formulario principal
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md border">
      <Toaster position="top-right" /> {/* Contenedor para toasts */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Postulación #{id}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Usuario: <strong>{userId?.slice(0, 8)}...</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select para estado de postulación */}
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

        {/* Campos para puntajes */}
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

        {/* Botón para enviar el formulario */}
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
