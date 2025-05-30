'use client'

import {
  ChartBarIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

const panels = [
  {
    title: 'Gestión de usuarios',
    description: 'Accede al módulo de gestión de cuentas y permisos.',
    icon: UserIcon,
  },
  {
    title: 'Reportes y estadísticas',
    description: 'Visualiza información agregada y exporta datos.',
    icon: ChartBarIcon,
  },
  {
    title: 'Documentación interna',
    description: 'Consulta guías y procesos administrativos.',
    icon: DocumentTextIcon,
  },
  {
    title: 'Control académico',
    description: 'Supervisa estados y resultados académicos.',
    icon: AcademicCapIcon,
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido/a, Administrador</h1>
      <p className="text-gray-600 text-lg mb-10 max-w-xl">
        Este es tu panel principal. Desde aquí puedes acceder a las funciones clave del sistema.
      </p>

      {/* Paneles informativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full">
        {panels.map((panel) => (
          <div
            key={panel.title}
            className="bg-white shadow rounded-xl p-6 flex items-start gap-4 border border-gray-100 text-left"
          >
            <panel.icon className="h-10 w-10 text-indigo-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{panel.title}</h3>
              <p className="text-sm text-gray-600">{panel.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}