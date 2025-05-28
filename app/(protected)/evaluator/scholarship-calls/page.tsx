'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { IScholarshipCall } from '@/types/scholarship-calls';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function ScholarshipCallsPage() {
    const [scholarshipCalls, setScholarshipCalls] = useState<IScholarshipCall[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchScholarshipCalls();
    }, []);

    const fetchScholarshipCalls = async () => {
        try {
            const { data, error } = await supabase
                .from('scholarship_calls')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setScholarshipCalls(data || []);
        } catch (error) {
            console.error('Error fetching scholarship calls:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta convocatoria?')) return;

        try {
            const { error } = await supabase
                .from('scholarship_calls')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchScholarshipCalls();
        } catch (error) {
            console.error('Error deleting scholarship call:', error);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Convocatorias de Becas</h1>
                <button
                    onClick={() => router.push('/evaluator/scholarship-calls/create')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nueva Convocatoria
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período Académico</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Inicio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Fin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {scholarshipCalls.map((call) => (
                            <tr key={call.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.academic_period}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(call.start_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(call.end_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => router.push(`/evaluator/scholarship-calls/${call.id}/edit`)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(call.id!)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
