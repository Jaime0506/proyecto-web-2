'use client'

import { use } from 'react'
import { DocumentTextIcon, AcademicCapIcon, UserGroupIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { FileText, Upload, AlertCircle } from 'lucide-react'
import { useScholarshipCall } from './hooks/useScholarshipCall'
import { useApplicationForm } from './hooks/useApplicationForm'

export default function ScholarshipCallDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { call, loading, error: callError } = useScholarshipCall(resolvedParams.id)
  const {
    formData,
    isSubmitting,
    error: formError,
    hasAlreadyApplied,
    handleSubmit,
    handleFileUpload,
    updateFormData
  } = useApplicationForm(resolvedParams.id)

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando convocatoria...</p>
      </div>
    )
  }

  if (callError || !call) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 text-lg">{callError || 'Convocatoria no encontrada'}</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AcademicCapIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">{call.name}</h1>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserGroupIcon className="h-5 w-5 text-gray-500" />
            <span>Periodo académico: <strong>{call.academic_period}</strong></span>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <DocumentCheckIcon className="h-5 w-5 text-gray-500" />
              <span><strong>Desde:</strong> {new Date(call.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <DocumentCheckIcon className="h-5 w-5 text-gray-500" />
              <span><strong>Hasta:</strong> {new Date(call.end_date).toLocaleDateString()}</span>
            </div>
          </div>

          {call.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6 text-gray-600" />
                Descripción
              </h2>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{call.description}</p>
            </div>
          )}

          {call.guideline_document && (
            <a
              href={call.guideline_document}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mt-4"
            >
              <FileText className="h-5 w-5 mr-2" />
              Ver documento de la convocatoria
            </a>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <DocumentTextIcon className="h-7 w-7 text-blue-600" />
          Formulario de Postulación
        </h2>

        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <p className="text-red-700">{formError}</p>
          </div>
        )}

        {hasAlreadyApplied ? (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <DocumentCheckIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Ya has postulado a esta convocatoria</h3>
            <p className="text-blue-600">Tu aplicación está siendo revisada. Te notificaremos cuando haya una actualización.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5 text-gray-500" />
                Estrato Socioeconómico
              </label>
              <select
                value={formData.socioeconomic_stratum}
                onChange={(e) => updateFormData('socioeconomic_stratum', Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {[1, 2, 3, 4, 5, 6].map((stratum) => (
                  <option key={stratum} value={stratum}>
                    Estrato {stratum}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5 text-gray-500" />
                Puntaje ICFES
              </label>
              <input
                type="number"
                value={formData.icfes_result_num || ''}
                onChange={(e) => updateFormData('icfes_result_num', Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                Certificado ICFES (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, 'icfes_result_pdf')}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <Upload className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                Certificado de Estrato (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, 'stratum_proof_pdf')}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                <Upload className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                Carta de Motivación (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, 'motivation_letter_pdf')}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                <Upload className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <DocumentCheckIcon className="h-5 w-5" />
                  Enviar Postulación
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
} 