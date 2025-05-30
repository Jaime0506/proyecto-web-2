'use client'

import { AcademicCapIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'


export default function AspirantHomePage() {
  const [fullName, setFullName] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()

      if (!data.user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single()

      setFullName(profile?.full_name ?? null)
    }

    fetchUser()
  }, [])

  return (
    <main className="min-h-screen flex justify-center bg-gradient-to-br from-indigo-50 to-white ">
      <div className="bg-white shadow-xl rounded-3xl h-[300px] max-w-3xl w-full p-10  border border-gray-100">
        <div className="text-center ">
          <AcademicCapIcon className="mx-auto h-14 w-14 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            {fullName ? `¡Bienvenido/a, ${fullName}!` : '¡Bienvenido/a aspirante!'}
          </h1>
          <p className="text-gray-600 text-base max-w-lg mx-auto">
            Este es tu espacio para conocer el estado de tu postulación, revisar tus datos y mantenerte al tanto de todo lo importante.
          </p>
        </div>

        <div className="bg-indigo-50 rounded-xl p-6 shadow-inner">
          <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-3">
            <SparklesIcon className="h-5 w-5" />
            ¿Qué puedes hacer aquí?
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Consultar el estado de tu postulación.</li>
            <li>Completar o actualizar tu información personal.</li>
            <li>Leer mensajes y notificaciones del equipo de admisión.</li>
          </ul>
        </div>

        <div className="flex justify-center items-center text-sm text-gray-400 gap-2 pt-4 border-t">
          <UserCircleIcon className="h-5 w-5" />
          Fundacion Amigos como Arroz
        </div>
      </div>
    </main>
  )
}
