"use client"

import { IScholarshipCall } from "@/types/scholarship-calls"
import { MouseEvent, useEffect, useState } from "react"
import CardScholarShip from "./card/CardScholarShip"
import ViewPDF from "@/app/components/ViewPDF"

interface ScholarCallsPageWrapperProps {
    data: IScholarshipCall[]
}

export default function ScholarCallsPageWrapper({ data }: ScholarCallsPageWrapperProps) {
    const [currentLinkDocument, setCurrentLinkDocument] = useState<string | null>(null);

    useEffect(() => { console.log(data) }, [data])

    const handleOnClick = (call: IScholarshipCall) => {
        console.log(call)
    }

    const handleOnOpenDocument = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, documentUrl?: string) => {
        if (!documentUrl) return
        e.stopPropagation()

        setCurrentLinkDocument(documentUrl)
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No hay convocatorias disponibles en este momento.
            </div>
        )
    }

    return (
        <>
            <main className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {data.map((call) => (
                        <CardScholarShip key={call.id} call={call} handleOnClick={handleOnClick} handleOnOpenDocument={handleOnOpenDocument} />
                    ))}
                </div>
            </main >

            <ViewPDF currentLinkDocument={currentLinkDocument} setCurrentLinkDocument={setCurrentLinkDocument} />
        </>
    )
}
