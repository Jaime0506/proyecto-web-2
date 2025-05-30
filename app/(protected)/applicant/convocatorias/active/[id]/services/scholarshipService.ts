import { createClient } from '@/lib/supabase/client'

export type ScholarshipCall = {
  id: number
  name: string
  academic_period: string
  start_date: string
  end_date: string
  description?: string
  guideline_document?: string
}

export type ApplicationForm = {
  socioeconomic_stratum: number
  icfes_result_num?: number
  icfes_result_pdf?: string
  stratum_proof_pdf?: string
  motivation_letter_pdf?: string
}

export const scholarshipService = {
  async getCallById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('scholarship_calls')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as ScholarshipCall
  },

  async submitApplication(callId: string, formData: ApplicationForm) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Debes iniciar sesión para aplicar')
    }

    const { error } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        call_id: callId,
        ...formData,
        status: 'PENDING'
      })

    if (error) throw error
  },

  async uploadDocument(file: File, field: string) {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`

    let folder = ''
    switch (field) {
      case 'icfes_result_pdf':
        folder = 'icfes_result'
        break
      case 'stratum_proof_pdf':
        folder = 'stratum_proof'
        break
      case 'motivation_letter_pdf':
        folder = 'motivation_letter'
        break
      default:
        folder = 'other'
    }

    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('scholarshipdocs')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    return filePath
  }
} 