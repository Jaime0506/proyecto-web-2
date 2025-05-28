'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { IScholarshipCall } from '@/types/scholarship-calls';
import ScholarshipCallForm from '../../components/ScholarshipCallForm';

export default function EditScholarshipCallPage() {
    const params = useParams();
    const supabase = createClient();
    const [scholarshipCall, setScholarshipCall] = useState<IScholarshipCall | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScholarshipCall = async () => {
            try {
                const { data, error } = await supabase
                    .from('scholarship_calls')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                setScholarshipCall(data);
            } catch (error) {
                console.error('Error fetching scholarship call:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarshipCall();
    }, [params.id, supabase]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!scholarshipCall) {
        return <div>Convocatoria no encontrada</div>;
    }

    return <ScholarshipCallForm mode="edit" initialData={scholarshipCall} />;
} 