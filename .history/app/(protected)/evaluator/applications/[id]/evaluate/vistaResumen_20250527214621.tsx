'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Application = {
  id: number
  user_id: string
  status: string
  icfes_score: number | null
  stratum_score: number | null
  interview_score: number | null
  total_score: number | null
}

export default function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('applications')
        .select('id, user_id, status, icfes_score, stratum_score, interview_score, total_score')
        .order('id', { ascending: true })

      if (error) {
        console.error('Error al cargar postulaciones:', error)
      } else {
        setApplications(data)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <p className="p-4">Cargando...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Postulaciones</h1>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Usuario</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">ICFES</th>
            <th className="p-2 border">Estrato</th>
            <th className="p-2 border">Entrevista</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="text-center">
              <td className="border p-2">{app.id}</td>
              <td className="border p-2">{app.user_id.slice(0, 8)}...</td>
              <td className="border p-2">{app.status}</td>
              <td className="border p-2">{app.icfes_score ?? '-'}</td>
              <td className="border p-2">{app.stratum_score ?? '-'}</td>
              <td className="border p-2">{app.interview_score ?? '-'}</td>
              <td className="border p-2 font-semibold">{app.total_score ?? '-'}</td>
              <td className="border p-2">
                <Link
                  href={`/evaluador/applications/${app.id}`}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Ver
                </Link>
                <Link
                  href={`/evaluador/applications/${app.id}/evaluate`}
                  className="text-green-600 hover:underline"
                >
                  Evaluar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
