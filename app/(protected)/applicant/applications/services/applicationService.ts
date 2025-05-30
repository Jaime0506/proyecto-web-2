import { createClient } from '@/lib/supabase/client'

export type Application = {
  id: number
  call_id: number
  user_id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  socioeconomic_stratum: number
  icfes_result_num?: number
  icfes_result_pdf?: string
  stratum_proof_pdf?: string
  motivation_letter_pdf?: string
  created_at: string
  scholarship_call: {
    name: string
    academic_period: string
    start_date: string
    end_date: string
  }
}

export const applicationService = {
  async getUserApplications() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Debes iniciar sesión para ver tus postulaciones')
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        scholarship_call:scholarship_calls (
          name,
          academic_period,
          start_date,
          end_date
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Obtener las URLs de los archivos para cada aplicación
    const applicationsWithUrls = await Promise.all(
      (data as Application[]).map(async (application) => {
        const urls = await Promise.all([
          application.icfes_result_pdf ? this.getFileUrl(application.icfes_result_pdf) : null,
          application.stratum_proof_pdf ? this.getFileUrl(application.stratum_proof_pdf) : null,
          application.motivation_letter_pdf ? this.getFileUrl(application.motivation_letter_pdf) : null,
        ])

        return {
          ...application,
          icfes_result_pdf: urls[0],
          stratum_proof_pdf: urls[1],
          motivation_letter_pdf: urls[2],
        }
      })
    )

    return applicationsWithUrls
  },

  async getFileUrl(filePath: string) {
    const supabase = createClient()
    const { data } = await supabase.storage
      .from('scholarshipdocs')
      .createSignedUrl(filePath, 3600) // URL válida por 1 hora

    return data?.signedUrl || null
  }
} 