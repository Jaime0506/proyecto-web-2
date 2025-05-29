import { IScholarshipCall } from '@/types/scholarship-calls';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from '@heroui/react';
import { format } from 'date-fns';
import { CalendarDays, FileText } from 'lucide-react';
import { MouseEvent } from 'react'

interface CardScholarShipProps {
    call: IScholarshipCall;
    handleOnClick: (call: IScholarshipCall) => void;
    handleOnOpenDocument: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, documentUrl?: string) => void;
}

export default function CardScholarShip({ call, handleOnClick, handleOnOpenDocument }: CardScholarShipProps) {
    return (
        <Card key={call.id} className="shadow-md transition-shadow duration-300 p-4 hover:scale-101" >
            <CardHeader className="flex justify-between">
                <h3 className="text-lg font-semibold text-primary">
                    {call.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {call.academic_period}
                </p>
            </CardHeader>
            <CardBody className="space-y-4">
                <div className="text-sm text-muted-foreground line-clamp-3">
                    {call.description || "Sin descripción"}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                        {format(new Date(call.start_date), "dd/MM/yyyy")} — {format(new Date(call.end_date), "dd/MM/yyyy")}
                    </span>
                </div>

                {call.guideline_document ? (
                    <button
                        type="button"
                        onClick={e => handleOnOpenDocument(e, call.guideline_document)}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                    >
                        <FileText className="w-4 h-4 mr-1" />
                        Ver reglamento
                    </button>
                ) : (
                    <p className="inline-flex items-center text-sm font-medium text-blue-600">
                        No hay reglamento disponible
                    </p>
                )}

                {/* Divider visual */}
                <Divider />

                {/* Información del creador */}
                {call.users && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <p>
                            <span className="font-medium text-primary">Creado por:</span>{" "}
                            {call.users.first_name} {call.users.last_name}
                        </p>
                        <p>
                            <span className="font-medium text-primary">Rol:</span>{" "}
                            <span>{call.users.role}</span>
                        </p>
                        <p>
                            <span className="font-medium text-primary">Registro:</span>{" "}
                            {format(new Date(call.users.created_at), "dd/MM/yyyy")}
                        </p>
                    </div>
                )}
            </CardBody>
            <CardFooter className="flex justify-end">
                <Button
                    onPress={() => handleOnClick(call)}
                    className="px-4 py-2 transition-colors"
                    color="primary"
                    variant="bordered"
                    radius="sm"
                >
                    Ver detalles
                </Button>
            </CardFooter>
        </Card>
    )
}

