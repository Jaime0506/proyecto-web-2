'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Card,
    CardHeader,
    CardBody,
    Select,
    SelectItem,
} from '@heroui/react'
import UserApplication from '../UserApplication'

type Call = {
    id: number
    name: string
}

export default function EvaluateListPage() {
    const supabase = createClient()

    const [calls, setCalls] = useState<Call[]>([])
    const [selectedCall, setSelectedCall] = useState("")
    const [selectedCallName, setSelectedCallName] = useState("");

    const fetchCalls = useCallback(async () => {
        const { data, error } = await supabase
            .from('scholarship_calls')
            .select('id, name')

        if (!error && data) setCalls(data)
    }, [supabase])

    const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        setSelectedCall(value)
    }

    useEffect(() => {
        fetchCalls()
    }, [fetchCalls])

    useEffect(() => {
        console.log(calls)
        setSelectedCallName(calls.find(call => call.id === Number(selectedCall))?.name || "")
    }, [selectedCall, calls])

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Revisar Postulaciones</h1>

            <Card className="p-4">
                <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-800">Seleccionar convocatoria</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                    <label htmlFor="convocatoria" className="text-sm font-medium text-primary">
                        Convocatoria disponible
                    </label>

                    <Select
                        label="Seleccionar convocatoria"
                        className="max-w-xs"
                        selectedKeys={[selectedCall]}
                        variant='bordered'
                        onChange={handleOnChange}
                    >
                        {calls.map((call) => (
                            <SelectItem key={call.id}>
                                {call.name}
                            </SelectItem>
                        ))}
                    </Select>
                </CardBody>
            </Card>

            {selectedCall && <UserApplication id_call={Number(selectedCall)} name_call={selectedCallName} />}
        </div>
    )
}
