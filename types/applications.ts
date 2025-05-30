enum ApplicationStatus {
    APPROVED = "APROBADO",
    PENDING = "PENDIENTE",
    REJECTED = "RECHAZADO",
    IN_REVIEW = "EN_REVISIÓN"
}

export interface IApplication {
    id: number;
    user_id: string;
    call_id: number;
    socioeconomic_stratum: number;
    icfes_result_num: number;
    icfes_result_pdf: number;
    stratum_proof_pdf: string;
    motivation_letter_pdf: string;
    status: ApplicationStatus;
    reviewed_by?: string;
    reviewed_at?: Date;
    created_at: Date;
}