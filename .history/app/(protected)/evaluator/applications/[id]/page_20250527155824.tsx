'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Application = {
  id: number;
  nombre_completo: string;
  email: string;
  document_number: string;
  // agrega más campos según tu base
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
        .eq('id', Number(id)) // ✅ conversión segura
        .single();

      if (error) {
        console.error('Error fetching application:', error);
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
      <p><strong>Nombre completo:</strong> {application.nombre_completo}</p>
      <p><strong>Correo:</strong> {application.email}</p>
      <p><strong>Documento:</strong> {application.document_number}</p>
      {/* Puedes seguir agregando más campos aquí */}
    </div>
  );
}
