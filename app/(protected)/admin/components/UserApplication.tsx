import ViewPDF from "@/app/components/ViewPDF"
import { createClient } from "@/lib/supabase/client"
import { Card, CardBody, CardHeader, CircularProgress, Button, Chip, Divider } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"

enum StatusApplication {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PENDING = "PENDING",
    IN_REVIEW = "IN_REVIEW"
}

interface Applications {
    call_id: number
    created_at: Date
    icfes_result_num: number
    icfes_result_pdf: string
    id: number
    motivation_letter_pdf: string
    reviewed_at: null
    reviewed_by: null
    socioeconomic_stratum: number
    status: StatusApplication
    stratum_proof_pdf: string
    user: {
        id: string
        national_id: string
        first_name: string
        last_name: string
        role: string
        status: string
        deleted: boolean
    }
}

interface UserApplicationProps {
    id_call: number
    name_call: string
}

export default function UserApplication({ id_call, name_call }: UserApplicationProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [userApplications, setUserApplications] = useState<Applications[] | null>(null)
    const [currentLinkDocument, setCurrentLinkDocument] = useState<string | null>(null);

    const fetchApplications = useCallback(async () => {
        const supabase = createClient()
        setIsLoading(true)

        const { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                user:user_id (
                    id,
                    national_id,
                    first_name,
                    last_name,
                    role,
                    status,
                    deleted
                )
            `)
            .eq('call_id', id_call)

        setIsLoading(false)

        if (error) {
            console.error("Error fetching applications:", error)
            return
        }

        setUserApplications(data as Applications[])
    }, [id_call])

    const statusBadgeColor = useCallback((status: StatusApplication) => {
        if (status == StatusApplication.APPROVED) return "success"

        if (status == StatusApplication.REJECTED) return "primary"

        if (status == StatusApplication.IN_REVIEW) return "warning"

        return "default"
    }, [])

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])


    if (isLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <CircularProgress aria-label="Loading..." />
            </div>
        )
    }

    if (!userApplications || userApplications.length === 0) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <p>No hay aplicaciones relacionadas a esta convocatoria</p>
            </div>
        )
    }

    return (
        <>
            <Card className="p-6 max-w-4xl mx-auto space-y-6 bg-white rounded-2xl">
                <h2 className="text-xl font-bold text-gray-800">Postulaciones encontradas</h2>
                {userApplications.map((app) => (
                    <Card key={app.id} className="bg-gray-50 p-4 rounded-xl space-y-2">
                        <CardHeader>
                            <div className="w-full flex justify-between">
                                <h3 className="text-lg font-bold text-primary">{name_call}</h3>


                                <Chip
                                    color={statusBadgeColor(app.status)}
                                    className="text-white"
                                >
                                    {app.status}
                                </Chip>

                            </div>
                        </CardHeader>
                        <CardBody className="space-y-2 text-sm text-gray-600">
                            <Divider />
                            <p><strong>Cedula: </strong> {app.user.national_id}</p>
                            <p><strong>Nombre: </strong> {app.user.first_name}</p>
                            <p><strong>Apellido: </strong> {app.user.last_name}</p>
                            <p><strong>Estrato socioeconómico:</strong> {app.socioeconomic_stratum}</p>
                            <p><strong>Puntaje ICFES:</strong> {app.icfes_result_num}</p>
                            <p><strong>Fecha de postulación:</strong> {new Date(app.created_at).toLocaleDateString()}</p>

                            <div className="flex gap-3 pt-2">
                                <Button size="sm" color="primary" onPress={() => setCurrentLinkDocument(app.icfes_result_pdf)}>
                                    Ver ICFES
                                </Button>
                                <Button size="sm" color="primary" onPress={() => setCurrentLinkDocument(app.stratum_proof_pdf)}>
                                    Ver estrato
                                </Button>
                                <Button size="sm" color="primary" onPress={() => setCurrentLinkDocument(app.motivation_letter_pdf)} >
                                    Carta de motivación
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </Card>
            <ViewPDF currentLinkDocument={currentLinkDocument} setCurrentLinkDocument={setCurrentLinkDocument} />

        </>
    )
}
