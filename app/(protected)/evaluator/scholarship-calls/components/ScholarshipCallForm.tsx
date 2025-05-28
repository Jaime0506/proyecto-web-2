'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { IScholarshipCall, IScholarshipCallForm } from '@/types/scholarship-calls';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ScholarshipCallFormProps {
    initialData?: IScholarshipCall;
    mode: 'create' | 'edit';
}

export default function ScholarshipCallForm({ initialData, mode }: ScholarshipCallFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<IScholarshipCallForm>({
        name: initialData?.name || '',
        academic_period: initialData?.academic_period || '',
        start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : '',
        end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const data = {
                ...formData,
                created_by: user.id,
            };

            if (mode === 'create') {
                const { error } = await supabase
                    .from('scholarship_calls')
                    .insert([data]);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('scholarship_calls')
                    .update(data)
                    .eq('id', initialData?.id);

                if (error) throw error;
            }

            router.push('/evaluator/scholarship-calls');
            router.refresh();
        } catch (error) {
            console.error('Error saving scholarship call:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
                        {mode === 'create' ? 'Nueva Convocatoria' : 'Editar Convocatoria'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre de la Convocatoria
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="academic_period" className="block text-sm font-medium text-gray-700">
                                Período Académico
                            </label>
                            <input
                                type="text"
                                id="academic_period"
                                value={formData.academic_period}
                                onChange={(e) => setFormData({ ...formData, academic_period: e.target.value })}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                Fecha de Inicio
                            </label>
                            <input
                                type="datetime-local"
                                id="start_date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                Fecha de Fin
                            </label>
                            <input
                                type="datetime-local"
                                id="end_date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 