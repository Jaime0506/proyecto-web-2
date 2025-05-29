'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Application = {
  id: number
  full_name: string
  status: string
}

export default function ApplicationsListPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient()
      let query = supabase.from('applications').select('id, full_name, status')

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error al cargar postulaciones:', error)
      } else {
        setApplications(data || [])
      }

      setLoading(false)
    }

    fetchApplications()
  }, [filter])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lista de Postulaciones</h1>

      {/* Filtro */}
      <div className="mb-6">
        <label htmlFor="filter" className="block font-medium mb-1">Filtrar por estado:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Todas</option>
          <option value="en_revision">🕐 En revisión</option>
          <option value="evaluated">📋 Evaluadas</option>
          <option value="aprobada">✅ Aprobadas</option>
          <option value="rechazada">❌ Rechazadas</option>
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <p>Cargando postulaciones...</p>
      ) : applications.length === 0 ? (
        <p>No hay postulaciones.</p>
      ) : (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">#</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="p-2">{app.id}</td>
                <td className="p-2">{app.full_name}</td>
                <td className="p-2 capitalize">{app.status}</td>
                <td className="p-2 space-x-2">
                  <Link
                    href={`/evaluator/applications/${app.id}/evaluate`}
                    className="text-blue-600 hover:underline"
                  >
                    Evaluar
                  </Link>
                  <Link
                    href={`/evaluator/applications/${app.id}/classify`}
                    className="text-green-600 hover:underline"
                  >
                    Clasificar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
