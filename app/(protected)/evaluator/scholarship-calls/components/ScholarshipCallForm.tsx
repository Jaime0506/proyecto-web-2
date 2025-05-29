'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { IScholarshipCall, IScholarshipCallForm } from '@/types/scholarship-calls';
import { ArrowLeftIcon, DocumentIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ScholarshipCallFormProps {
    initialData?: IScholarshipCall;
    mode: 'create' | 'edit';
}

export default function ScholarshipCallForm({ initialData, mode }: ScholarshipCallFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<IScholarshipCallForm>({
        name: initialData?.name || '',
        academic_period: initialData?.academic_period || '',
        start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : '',
        end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : '',
        description: initialData?.description || '',
        guideline_document: initialData?.guideline_document || '',
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Por favor, selecciona un archivo PDF');
            return;
        }

        setUploading(true);
        setError(null);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('scholarshipdocs')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Error al subir el archivo:', uploadError);
                throw new Error(`Error al subir el archivo: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('scholarshipdocs')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, guideline_document: publicUrl }));
        } catch (error) {
            console.error('Error detallado:', error);
            setError(error instanceof Error ? error.message : 'Error al subir el archivo');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

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
            setError(error instanceof Error ? error.message : 'Error al guardar la convocatoria');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {mode === 'create' ? 'Nueva Convocatoria' : 'Editar Convocatoria'}
                                </h3>
                                <p className="mt-2 text-sm text-gray-700">
                                    {mode === 'create' 
                                        ? 'Complete el formulario para crear una nueva convocatoria de becas.'
                                        : 'Modifique los campos necesarios para actualizar la convocatoria.'}
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nombre de la Convocatoria
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Descripción
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="academic_period" className="block text-sm font-medium text-gray-700">
                                    Período Académico
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="academic_period"
                                        value={formData.academic_period}
                                        onChange={(e) => setFormData({ ...formData, academic_period: e.target.value })}
                                        required
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                        Fecha de Inicio
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="datetime-local"
                                            id="start_date"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                            required
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                        Fecha de Fin
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="datetime-local"
                                            id="end_date"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                            required
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="guideline_document" className="block text-sm font-medium text-gray-700">
                                    Documento de Lineamientos (PDF)
                                </label>
                                <div className="mt-1 flex items-center">
                                    <input
                                        type="file"
                                        id="guideline_document"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="guideline_document"
                                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <DocumentIcon className="h-5 w-5 mr-2 text-gray-900" />
                                        {uploading ? 'Subiendo...' : 'Seleccionar PDF'}
                                    </label>
                                    {formData.guideline_document && (
                                        <a
                                            href={formData.guideline_document}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-4 text-sm text-red-800 hover:text-red-900"
                                        >
                                            Ver documento actual
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                    {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 