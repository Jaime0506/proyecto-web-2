'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Application = {
  id: number;
  user_id: string;
  call_id: number;
  socioeconomic: number;
  icfes_result: number;
  icfes_result_pdf: string;
  stratum_proof_pdf: string;
};

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', Number(id)) // 
        .single();

      if (error) {
        console.error('Error al obtener la postulación:', error);
      } else {
        setApplication(data);
      }

      setLoading(false);
    };

    if (id) fetchApplication();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!application) return <div>No se encontró la postulación.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalles de la postulación</h1>
      <p><strong>ID:</strong> {application.id}</p>
      <p><strong>Usuario:</strong> {application.user_id}</p>
      <p><strong>Convocatoria:</strong> {application.call_id}</p>
      <p><strong>Estrato:</strong> {application.socioeconomic}</p>
      <p><strong>Puntaje ICFES:</strong> {application.icfes_result}</p>
      <p>
        <strong>Resultado ICFES PDF:</strong>{' '}
        <a href={application.icfes_result_pdf} target="_blank" className="text-blue-600 underline">
          Ver documento
        </a>
      </p>
      <p>
        <strong>Certificado de estrato:</strong>{' '}
        <a href={application.stratum_proof_pdf} target="_blank" className="text-blue-600 underline">
          Ver documento
        </a>
      </p>
    </div>
  );
}
