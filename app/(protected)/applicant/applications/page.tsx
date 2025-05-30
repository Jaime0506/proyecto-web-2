'use client'

import { DocumentTextIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { useApplications } from './hooks/useApplications'

export default function ApplicationsPage() {
  const {
    applications,
    loading,
    error,
    getStatusColor,
    getStatusText
  } = useApplications()

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando postulaciones...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const renderDocumentLink = (url: string | null | undefined, label: string) => {
    if (!url) {
      return (
        <span className="text-gray-400 text-sm flex items-center gap-1">
          <DocumentTextIcon className="h-4 w-4" />
          {label} (No disponible)
        </span>
      )
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
      >
        <DocumentTextIcon className="h-4 w-4" />
        {label}
      </a>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <DocumentTextIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Mis Postulaciones</h1>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes postulaciones</h3>
          <p className="text-gray-500">Aún no has postulado a ninguna convocatoria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {application.scholarship_call.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <AcademicCapIcon className="h-5 w-5 text-gray-500" />
                    <span>Periodo: {application.scholarship_call.academic_period}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                    <span>
                      Fecha de postulación: {new Date(application.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    application.status
                  )}`}
                >
                  {getStatusText(application.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Estrato socioeconómico:</p>
                  <p className="font-medium">{application.socioeconomic_stratum}</p>
                </div>
                {application.icfes_result_num && (
                  <div>
                    <p className="text-gray-600">Puntaje ICFES:</p>
                    <p className="font-medium">{application.icfes_result_num}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Documentos adjuntos:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {renderDocumentLink(application.icfes_result_pdf, 'Certificado ICFES')}
                  {renderDocumentLink(application.stratum_proof_pdf, 'Certificado de Estrato')}
                  {renderDocumentLink(application.motivation_letter_pdf, 'Carta de Motivación')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 