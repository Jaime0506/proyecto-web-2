'use client' // Indica que este componente se ejecuta en el cliente (browser)

import { AcademicCapIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline' // Iconos de Heroicons
import { useEffect, useState } from 'react' // Hooks de React
import { createClient } from '@/lib/supabase/client' // Cliente de Supabase configurado

export default function AspirantHomePage() {
  // Estado para almacenar el nombre completo del usuario
  const [fullName, setFullName] = useState<string | null>(null)

  // Hook que se ejecuta al montar el componente
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()

      // Obtener el usuario autenticado
      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      // Consultar el perfil del usuario por su ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single()

      // Guardar el nombre en el estado
      setFullName(profile?.full_name ?? null)
    }

    fetchUser() // Ejecutar la función al cargar
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-white px-4">
      {/* Contenedor principal centrado */}
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-4xl p-10 border border-gray-100 space-y-8">
        
        {/* Sección de bienvenida */}
        <div className="text-center space-y-4">
          <AcademicCapIcon className="mx-auto h-16 w-16 text-indigo-600" /> {/* Icono de gorro académico */}
          <h1 className="text-4xl font-extrabold text-gray-800">
            {/* Mostrar el nombre del usuario si existe, si no, texto genérico */}
            {fullName ? `¡Bienvenido/a, ${fullName}!` : '¡Bienvenido/a aspirante!'}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Nos alegra tenerte aquí. En esta plataforma podrás gestionar tu postulación, estar al tanto de novedades y asegurarte de que todo esté en orden para tu futuro académico.
          </p>
        </div>

        {/* Sección de funcionalidades */}
        <div className="bg-indigo-50 rounded-xl p-6 shadow-inner space-y-4">
          <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
            <SparklesIcon className="h-6 w-6" /> {/* Icono de estrella */}
            ¿Qué puedes hacer aquí?
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
            <li>Revisar el estado de tu postulación.</li>
            <li>Actualizar tu información personal y académica.</li>
            <li>Recibir mensajes importantes del comité de admisiones.</li>
          </ul>
        </div>

        {/* Pie de página */}
        <footer className="flex justify-center items-center text-sm text-gray-400 gap-2 pt-6 border-t border-gray-200">
          <UserCircleIcon className="h-5 w-5" /> {/* Icono de usuario */}
          Fundación Amigos como Arroz
        </footer>
      </div>
    </main>
  )
}

