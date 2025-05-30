'use client' // Indica que este componente se ejecuta en el cliente

// Importación de hooks y utilidades necesarias
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation' // Para obtener parámetros de la URL
import { createClient } from '@/lib/supabase/client' // Cliente Supabase personalizado
import toast, { Toaster } from 'react-hot-toast' // Librería para mostrar notificaciones
import { ArrowPathIcon } from '@heroicons/react/24/outline' // Icono de carga

// Definición de criterios de evaluación con su nombre (clave) y etiqueta
const criterios = [
  { name: 'rendimiento_academico', label: '📚 Rendimiento Académico' },
  { name: 'situacion_economica', label: '💸 Situación Económica' },
  { name: 'motivacion', label: '🔥 Motivación' },
  { name: 'experiencia', label: '🛠️ Experiencia' }
]

export default function ScoringPage() {
  const params = useParams() // Obtener parámetros de la ruta
  const id = params?.id as string // ID de la postulación desde la URL

  // Estados del componente
  const [loading, setLoading] = useState(true) // Indica si está cargando
  const [userId, setUserId] = useState<string | null>(null) // Almacena el ID del usuario autenticado
  const [scores, setScores] = useState({ // Estado para los puntajes
    rendimiento_academico: null,
    situacion_economica: null,
    motivacion: null,
    experiencia: null,
  })

  // Carga inicial: autenticación y datos existentes
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Obtener usuario autenticado
      const { data: authData, error: userError } = await supabase.auth.getUser()

      if (userError || !authData?.user?.id) {
        toast.error('Debes iniciar sesión para acceder') // Mostrar error si no hay sesión
        setLoading(false)
        return
      }

      setUserId(authData.user.id) // Guardar el ID del usuario

      // Buscar puntajes anteriores para esta postulación
      const { data, error } = await supabase
        .from('application_scores')
        .select('*')
        .eq('application_id', Number(id))
        .single()

      // Si hay error (y no es que no existe), mostrar mensaje
      if (error && error.code !== 'PGRST116') {
        console.error(error)
        toast.error('Error al cargar los puntajes')
      } else if (data) {
        // Si hay datos, actualizarlos en el estado
        setScores({
          rendimiento_academico: data.rendimiento_academico,
          situacion_economica: data.situacion_economica,
          motivacion: data.motivacion,
          experiencia: data.experiencia
        })
      }

      setLoading(false) // Finaliza la carga
    }

    if (id) fetchData() // Ejecutar la función si existe un ID en la URL
  }, [id])

  // Manejador de cambios de input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setScores((prev) => ({
      ...prev,
      [name]: Number(value) // Convertir a número y actualizar el campo correspondiente
    }))
  }

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    if (!userId) {
      toast.error('No se puede guardar sin usuario autenticado')
      return
    }

    const now = new Date().toISOString() // Fecha actual en ISO

    // Actualizar la tabla de aplicaciones con la fecha y usuario que revisó
    const { error: appError } = await supabase
      .from('applications')
      .update({
        reviewed_at: now,
        reviewed_by: userId,
      })
      .eq('id', Number(id))

    if (appError) {
      console.error('Error al actualizar aplicación:', appError)
      toast.error('Error al actualizar la postulación')
      return
    }

    toast.success('Fecha y usuario de revisión actualizados')

    // Verificar si ya existen puntajes para esta postulación
    const { data: existing } = await supabase
      .from('application_scores')
      .select('id')
      .eq('application_id', Number(id))
      .single()

    let result
    if (existing) {
      // Si ya existen, hacer update
      result = await supabase
        .from('application_scores')
        .update(scores)
        .eq('application_id', Number(id))
    } else {
      // Si no existen, insertar nuevos datos
      result = await supabase
        .from('application_scores')
        .insert({ application_id: Number(id), ...scores })
    }

    // Mostrar notificación según el resultado
    if (result.error) {
      console.error(result.error)
      toast.error('❌ Error al guardar los puntajes')
    } else {
      toast.success('✅ Puntajes guardados correctamente')
    }
  }

  // Vista de carga mientras se obtienen datos
  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-gray-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        Cargando...
      </div>
    )
  }

  // Vista principal del formulario
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md border">
      <Toaster position="top-right" /> {/* Contenedor para mostrar toasts */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Asignar Puntajes - Postulación #{id}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Iterar sobre cada criterio para mostrar un input */}
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

        {/* Botón para guardar puntajes */}
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
