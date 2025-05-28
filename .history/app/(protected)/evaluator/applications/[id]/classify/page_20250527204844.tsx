'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ClassifyApplicationPage() {
  const { id } = useParams()
  const router = useRouter()
  const [status, setStatus] = useState('en_revision')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('applications')
        .select('status')
        .eq('id', Number(id))
        .single()
 
      if (error) {
        console.error('Error al obtener el estado:', error)
      } else if (data) {
        setStatus(data.status || 'en_revision')
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
      router.push('/protected/evaluator') // Puedes cambiar a la vista que desees
    }
  }

  if (loading) return <p className="p-4">Cargando...</p>

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Clasificar Postulación #{id}</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Estado:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="en_revision">En revisión</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar clasificación
        </button>
      </form>
    </div>
  )
}
