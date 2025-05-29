'use client'

import React from 'react'
import {
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  EyeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'

export default function EvaluatorDashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Panel del Evaluador
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Bienvenido/a. Desde este panel puedes gestionar las postulaciones, clasificarlas, ver su historial y crear nuevas convocatorias.
        Tu labor es esencial para asegurar un proceso transparente y eficiente.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border hover:shadow-lg transition">
          <ClipboardDocumentListIcon className="h-10 w-10 text-blue-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Revisar postulaciones</h2>
          <p className="text-gray-600 text-sm">
            Accede a las solicitudes enviadas y analiza la información de cada postulante para evaluarlas.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border hover:shadow-lg transition">
          <CheckBadgeIcon className="h-10 w-10 text-green-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Clasificar solicitudes</h2>
          <p className="text-gray-600 text-sm">
            Asigna un estado a cada postulación: Aprobada, Rechazada, En revisión o Pendiente.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border hover:shadow-lg transition">
          <EyeIcon className="h-10 w-10 text-purple-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Ver historial</h2>
          <p className="text-gray-600 text-sm">
            Consulta el historial de clasificaciones y revisiones realizadas por ti u otros evaluadores.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border hover:shadow-lg transition">
          <CalendarDaysIcon className="h-10 w-10 text-red-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Crear convocatorias</h2>
          <p className="text-gray-600 text-sm">
            Publica nuevas convocatorias para que los postulantes puedan aplicar en los plazos definidos.
          </p>
        </div>
      </div>
    </div>
  )
}
