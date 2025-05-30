"use client"

import { createClient } from "@/lib/supabase/client"
import {
    Card,
    CardBody,
    CardHeader,
    CircularProgress,
    Chip,
    Divider
} from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

enum StatusApplication {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PENDING = "PENDING",
    IN_REVIEW = "IN_REVIEW"
}

interface ApplicationScores {
    id: number
    application_id: number
    rendimiento_academico: number
    situacion_economica: number
    motivacion: number
    experiencia: number
}

interface Evaluators {
    id: number
    socioeconomic_stratum: number
    icfes_result_num: number
    status: StatusApplication
    application_scores: ApplicationScores | null
    user: {
        id: string
        national_id: string
        first_name: string
        last_name: string
    } | null
}

interface EvaluatorsApplicationsProps {
    id_user: string
}

export default function EvaluatorsApplications({ id_user }: EvaluatorsApplicationsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [evaluator, setEvaluator] = useState<Evaluators[] | null>(null)

    const fetchEvaluations = useCallback(async () => {
        const supabase = createClient()
        setIsLoading(true)

        const { data, error } = await supabase
            .from("applications")
            .select(`
        id,
        socioeconomic_stratum,
        icfes_result_num,
        status,
        application_scores (
          id,
          application_id,
          rendimiento_academico,
          situacion_economica,
          motivacion,
          experiencia
        ),
        user:user_id (
          id,
          national_id,
          first_name,
          last_name
        )
      `)
            .eq("reviewed_by", id_user)

        setIsLoading(false)

        if (error) {
            toast.error("Error al cargar las evaluaciones")
            return
        }

        if (data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapped = data.map((app: any) => ({
                ...app,
                application_scores: app.application_scores?.[0] ?? null,
                user: app.user ?? null
            }))
            setEvaluator(mapped)
        }
    }, [id_user])

    const statusBadgeColor = useCallback((status: StatusApplication) => {
        if (status === StatusApplication.APPROVED) return "success"
        if (status === StatusApplication.REJECTED) return "primary"
        if (status === StatusApplication.IN_REVIEW) return "warning"
        return "default"
    }, [])

    useEffect(() => {
        fetchEvaluations()
    }, [fetchEvaluations])

    if (isLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <CircularProgress aria-label="Loading..." />
            </div>
        )
    }

    if (!evaluator || evaluator.length === 0) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <p>No hay evaluaciones registradas para este evaluador.</p>
            </div>
        )
    }

    return (
        <Card className="p-6 max-w-4xl mx-auto space-y-6 bg-white rounded-2xl">
            <h2 className="text-xl font-bold text-gray-800">Evaluaciones realizadas</h2>

            {evaluator.map((app) => (
                <Card key={app.id} className="bg-gray-50 p-4 rounded-xl space-y-2">
                    <CardHeader>
                        <div className="w-full flex justify-between">
                            <h3 className="text-lg font-bold text-primary">
                                Postulación #{app.id}
                            </h3>
                            <Chip color={statusBadgeColor(app.status)} className="text-white">
                                {app.status}
                            </Chip>
                        </div>
                    </CardHeader>

                    <CardBody className="space-y-2 text-sm text-gray-600">
                        <Divider />
                        <p><strong>Cédula:</strong> {app.user?.national_id ?? '—'}</p>
                        <p><strong>Nombre:</strong> {app.user?.first_name ?? '—'}</p>
                        <p><strong>Apellido:</strong> {app.user?.last_name ?? '—'}</p>
                        <p><strong>Estrato socioeconómico:</strong> {app.socioeconomic_stratum}</p>
                        <p><strong>Puntaje ICFES:</strong> {app.icfes_result_num}</p>

                        <Divider />

                        <h4 className="font-medium text-gray-800 pt-2">Puntajes de Evaluación:</h4>
                        {app.application_scores ? (
                            <div className="space-y-1">
                                <p><strong>Rendimiento académico:</strong> {app.application_scores.rendimiento_academico}</p>
                                <p><strong>Situación económica:</strong> {app.application_scores.situacion_economica}</p>
                                <p><strong>Motivación:</strong> {app.application_scores.motivacion}</p>
                                <p><strong>Experiencia:</strong> {app.application_scores.experiencia}</p>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Sin evaluación registrada.</p>
                        )}
                    </CardBody>
                </Card>
            ))}
        </Card>
    )
}
