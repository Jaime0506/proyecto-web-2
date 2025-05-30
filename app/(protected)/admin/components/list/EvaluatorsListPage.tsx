"use client"

import { createClient } from '@/lib/supabase/client';
import { Card, CardBody, CardHeader, Select, SelectItem } from '@heroui/react';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner';
import EvaluatorsApplications from '../EvaluatorsApplications';

type Evaluator = {
    id: string
    national_id: number
    first_name: string
    last_name: string
}

export default function EvaluatorsListPage() {
    const supabase = createClient()

    const [evaluators, setEvaluators] = useState<Evaluator[]>([])
    const [selectedEvaluator, setSelectedEvaluator] = useState("");

    const fetchCalls = useCallback(async () => {
        const { data, error } = await supabase
            .from('users')
            .select('id, national_id, first_name, last_name')
            .eq('role', 'EVALUATOR')

        if (error) {
            toast.error("Error al cargar los evaluadores")
            return
        }

        if (data) {
            setEvaluators(data)
        }
    }, [supabase])

    const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        setSelectedEvaluator(value)
    }

    useEffect(() => {
        fetchCalls()
    }, [fetchCalls])

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Revisar Evaluaciones</h1>

            <Card className="p-4">
                <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-800">Seleccionar Evaluador</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                    <label htmlFor="convocatoria" className="text-sm font-medium text-primary">
                        Evaluador
                    </label>

                    <Select
                        label="Seleccionar convocatoria"
                        className="max-w-xs"
                        selectedKeys={[selectedEvaluator]}
                        variant='bordered'
                        onChange={handleOnChange}
                    >
                        {evaluators.map((evaluator) => (
                            <SelectItem key={evaluator.id} textValue={`${evaluator.first_name} - ${evaluator.last_name} - (${evaluator.national_id})`}>
                                {evaluator.first_name} - {evaluator.last_name} - ({evaluator.national_id})
                            </SelectItem>
                        ))}
                    </Select>
                </CardBody>
            </Card>

            {selectedEvaluator && <EvaluatorsApplications id_user={selectedEvaluator} />}
        </div>
    )
}
