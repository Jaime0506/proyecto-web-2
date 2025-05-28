'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Application = {
  id: number
  applicant_name: string // o cualquier campo útil
  status: string
}

export default function EvaluatorApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient()

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('No se pudo obtener el usuario:', userError)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('applications')
        .select('id, applicant_name, status')
        .eq('assigned_evaluator_id', user.id) // Filtrar solo las asignadas

      if (error) {
        console.error('Error al obtener aplicaciones:', error)
      } else {
        setApplications(data || [])
      }

      setLoading(false)
    }

    fetchApplications()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Postulaciones Asignadas</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : applications.length === 0 ? (
        <p>No tienes postulaciones asignadas.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app.id} className="border p-4 rounded shadow">
              <p className="font-semibold">Postulante: {app.applicant_name}</p>
              <p>Estado: {app.status}</p>
              <Link
                href={`/evaluator/applications/${app.id}/evaluate`}
                className="text-blue-600 underline mt-2 inline-block"
              >
                Evaluar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
