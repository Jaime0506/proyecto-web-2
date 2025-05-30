'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@tremor/react'
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react'
import { Select, SelectItem } from '@tremor/react'
import { Button } from '@tremor/react'

type Application = {
  id: number
  user_id: string
  call_id: number
  socioeconomic_stratum: number
  icfes_result_num: number
  icfes_result_pdf: string
  stratum_proof_pdf: string
  motivation_letter_pdf: string
  status: string
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

type Call = {
  id: number
  name: string
}

export default function EvaluateListPage() {
  const router = useRouter()
  const supabase = createClient()

  const [calls, setCalls] = useState<Call[]>([])
  const [selectedCall, setSelectedCall] = useState<number | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCalls = async () => {
      const { data, error } = await supabase
        .from('scholarship_calls')
        .select('id, name')
      if (!error) setCalls(data)
    }

    fetchCalls()
  }, [])

  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedCall) return
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('call_id', selectedCall)

      if (!error) setApplications(data)
      setLoading(false)
    }

    fetchApplications()
  }, [selectedCall])

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Evaluar Postulaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="font-medium mb-1 block">Seleccionar convocatoria:</label>
            <Select
              value={selectedCall?.toString() || ''}
              onValueChange={(value) => setSelectedCall(Number(value))}
              placeholder="Selecciona una convocatoria"
            >
              {calls.map(call => (
                <SelectItem key={call.id} value={call.id.toString()}>
                  {call.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          {loading ? (
            <p className="text-gray-500">Cargando postulaciones...</p>
          ) : selectedCall && (
            <Table className="mt-6">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Usuario</TableHeaderCell>
                  <TableHeaderCell>Estrato</TableHeaderCell>
                  <TableHeaderCell>ICFES</TableHeaderCell>
                  <TableHeaderCell>PDF ICFES</TableHeaderCell>
                  <TableHeaderCell>PDF Estrato</TableHeaderCell>
                  <TableHeaderCell>PDF Carta</TableHeaderCell>
                  <TableHeaderCell>Estado</TableHeaderCell>
                  <TableHeaderCell>Revisado por</TableHeaderCell>
                  <TableHeaderCell>Revisado en</TableHeaderCell>
                  <TableHeaderCell>Creado en</TableHeaderCell>
                  <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map(app => (
                  <TableRow key={app.id}>
                    <TableCell>{app.id}</TableCell>
                    <TableCell>{app.user_id}</TableCell>
                    <TableCell>{app.socioeconomic_stratum}</TableCell>
                    <TableCell>{app.icfes_result_num}</TableCell>
                    <TableCell>
                      <a href={app.icfes_result_pdf} className="text-blue-600 underline" target="_blank" rel="noreferrer">Ver</a>
                    </TableCell>
                    <TableCell>
                      <a href={app.stratum_proof_pdf} className="text-blue-600 underline" target="_blank" rel="noreferrer">Ver</a>
                    </TableCell>
                    <TableCell>
                      <a href={app.motivation_letter_pdf} className="text-blue-600 underline" target="_blank" rel="noreferrer">Ver</a>
                    </TableCell>
                    <TableCell>{app.status}</TableCell>
                    <TableCell>{app.reviewed_by ?? '-'}</TableCell>
                    <TableCell>{app.reviewed_at ? new Date(app.reviewed_at).toLocaleString() : '-'}</TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="xs" onClick={() => router.push(`/evaluator/applications/evaluate/${app.id}`)}>
                        Evaluar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
