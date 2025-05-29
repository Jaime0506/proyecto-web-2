'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

export default function ClassifyApplicationPage() {
  const { id } = useParams()
  const router = useRouter()
  const [status, setStatus] = useState('IN_REVIEW')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('applications')
        .select('status, user_id')
        .eq('id', Number(id))
        .single()

      if (error) {
        console.error('Error al obtener el estado:', error)
        toast.error('Error al cargar los datos de la postulación', {
          style: {
            background: '#f87171',
            color: 'white',
            borderRadius: '8px',
          },
          icon: '⚠️',
        })
      } else if (data) {
        // Usar valor tal cual para que coincida con las opciones
        setStatus(data.status || 'IN_REVIEW')
        setUserId(data.user_id)
      }

      setLoading(false)
    }

    if (id) fetchStatus()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', Number(id))

    if (error) {
      console.error('Error al actualizar estado:', error)
      toast.error('No se pudo guardar la evaluación', {
        style: {
          background: '#f87171',
          color: 'white',
          borderRadius: '8px',
        },
        icon: '⚠️',
      })
    } else {
      toast.success('Evaluación guardada correctamente', {
        style: {
          background: '#4ade80',
          color: 'white',
          borderRadius: '8px',
        },
        icon: '✅',
      })
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
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md border">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '0.9rem',
            borderRadius: '8px',
          },
        }}
      />
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Clasificar Postulación #{id}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Usuario: <strong>{userId?.slice(0, 8)}...</strong>
      </p>

      <form onSubmit={handleUpdate} className="space-y-6">
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

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow"
        >
          Guardar clasificación
        </button>
      </form>
    </div>
  )
}
