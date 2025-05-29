'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function ClassifyApplicationPage() {
  const { id } = useParams()
  const router = useRouter()
  const [status, setStatus] = useState('en_revision')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('applications')
        .select('status, full_name')
        .eq('id', Number(id))
        .single()

      if (error) {
        console.error('Error al obtener el estado:', error)
      } else if (data) {
        setStatus(data.status || 'en_revision')
        setFullName(data.full_name || '')
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
    } else {
      alert('Estado actualizado correctamente')
      router.push('/evaluator/applications')
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
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Clasificar Postulación #{id}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Postulante: <strong>{fullName}</strong>
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
            className=""
            required
          >
            <option value="approved">✅ Aprobada</option>
            <option value="rejected">❌ Rechazada</option>
            <option value="in_review">🕐 En revisión</option>
            <option value="pending">⏳ Pendiente</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow"
        >
          Guardar clasificación
        </button>
      </form>
    </div>
  )
}

